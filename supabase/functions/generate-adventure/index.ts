import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const authHeader = req.headers.get("Authorization");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!,
      { global: { headers: { Authorization: authHeader! } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { other_user_id } = await req.json();
    if (!other_user_id) throw new Error("other_user_id required");

    // Normalize pair order for consistent lookups
    const [user1, user2] = [user.id, other_user_id].sort();

    // Check for existing plan
    const { data: existing } = await supabase
      .from("adventure_plans")
      .select("plan_text")
      .eq("user1_id", user1)
      .eq("user2_id", user2)
      .maybeSingle();

    if (existing?.plan_text) {
      return new Response(JSON.stringify({ plan: existing.plan_text }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch both profiles
    const { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .in("user_id", [user.id, other_user_id]);

    if (!profiles || profiles.length < 2) {
      return new Response(JSON.stringify({ error: "Profiles not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const myProfile = profiles.find((p: any) => p.user_id === user.id);
    const otherProfile = profiles.find((p: any) => p.user_id === other_user_id);

    const levelMap: Record<string, string> = {
      light: "Лайт (пьёт мало, предпочитает культурный отдых)",
      navigator: "Штурман (уверенный середнячок)",
      candidate: "Кандидат наук (серьёзный уровень)",
      master: "Мастер спорта (легенда, держитесь)",
    };

    const prompt = `Ты — безумный генератор приключений для приложения "Собутыльник". 
Создай юмористический план вечера "Миссия: Ночь" для двух участников.

Участник 1: ${myProfile.name}
- Интересы: ${(myProfile.interests || []).join(", ") || "не указаны"}
- Напитки: ${(myProfile.drinks || []).join(", ") || "не указаны"}
- Норма: ${levelMap[myProfile.alcohol_level] || "не указана"}

Участник 2: ${otherProfile.name}
- Интересы: ${(otherProfile.interests || []).join(", ") || "не указаны"}
- Напитки: ${(otherProfile.drinks || []).join(", ") || "не указаны"}
- Норма: ${levelMap[otherProfile.alcohol_level] || "не указана"}

ПРАВИЛА:
- Если один из участников "Лайт" — план более культурный и спокойный.
- Если оба "Мастера спорта" — план максимально безумный и эпичный.
- Учитывай общие интересы и напитки обоих участников.
- Формат: структурированный план с этапами (🕐 Этап 1, 🕑 Этап 2 и т.д.)
- Каждый этап: время, место/активность, напиток, безумный комментарий.
- 4-6 этапов, последний — "финал миссии" с эпичным завершением.
- Стиль: дерзкий, ироничный, с юмором. Используй эмодзи.
- Пиши на русском языке.
- НЕ используй markdown форматирование (без **, ##, и т.д.), пиши простым текстом.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "Ты креативный и юмористический генератор планов на вечер." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Слишком много запросов, попробуйте позже" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Необходимо пополнить баланс" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await aiResponse.text();
      console.error("AI error:", aiResponse.status, errText);
      throw new Error("AI gateway error");
    }

    const aiData = await aiResponse.json();
    const planText = aiData.choices?.[0]?.message?.content || "План не удалось сгенерировать";

    // Save plan for both users
    await supabase.from("adventure_plans").insert({
      user1_id: user1,
      user2_id: user2,
      plan_text: planText,
    });

    return new Response(JSON.stringify({ plan: planText }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
