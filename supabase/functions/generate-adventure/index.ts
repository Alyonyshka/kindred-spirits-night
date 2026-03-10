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

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    }

    const authHeader = req.headers.get("Authorization");
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader! } },
    });

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

    const prompt = `Ты — безумный генератор ТРЕШ-ПРИКЛЮЧЕНИЙ для приложения "Собутыльник". 
Создай юмористический план вечера "Миссия: Ночь" для двух участников в стиле ТРЕШ-ПРИКЛЮЧЕНИЙ и ТРЕШ-ЗАДАНИЙ в режиме общего унисекс-угара.

Участник 1: ${myProfile.name}
- Интересы: ${(myProfile.interests || []).join(", ") || "не указаны"}
- Напитки: ${(myProfile.drinks || []).join(", ") || "не указаны"}
- Норма: ${levelMap[myProfile.alcohol_level] || "не указана"}

Участник 2: ${otherProfile.name}
- Интересы: ${(otherProfile.interests || []).join(", ") || "не указаны"}
- Напитки: ${(otherProfile.drinks || []).join(", ") || "не указаны"}
- Норма: ${levelMap[otherProfile.alcohol_level] || "не указана"}

СТИЛЬ И ФОРМАТ:
- Используй забавный сленг (вместо «пойти гулять» — «выдвинуться в экспедицию за истиной», вместо «выпить» — «заправить двигатель» и т.д.)
- Миссии должны быть связаны с незнакомцами в баре и улицей — интерактив с реальным миром!
- Каждый этап = миссия-вызов (Challenge) с фотоотчетом или видеодоказательством.
- Градация «Опасности»: после каждого выпитого напитка уровень сложности миссий растёт.
- Формат: 5-7 этапов (🕐 Этап 1 / Уровень опасности: 1/5, 🕑 Этап 2 / Уровень опасности: 2/5, и т.д.)
- Каждый этап содержит: название миссии, описание задания, напиток этапа, уровень опасности, награда за выполнение, штраф за провал.
- Последний этап — ФИНАЛ МИССИИ с эпичным завершением.

ПРИМЕРЫ МИССИЙ (вдохновляйся, но генерируй уникальные):
- «Тайный агент 0.5»: Выбрать «жертву» (незнакомца) и 2 минуты вести за ним слежку, используя меню как маскировку. Фото «из засады».
- «Голос улиц»: Выйти на улицу и громко прокричать «Я заказываю музыку!». Записать видео реакции прохожих.
- «Бартерный обмен»: Обменять салфетку на предмет у другого столика. Фото трофея.
- «Добыть легендарную шаурму из ларька, который охраняет суровый кот-сфинкс. Уровень скрытности: Танцующий медведь»

СИСТЕМА ШТРАФОВ (обязательно включи 3-5 штрафов в план):
- «Коктейль Молотова»: Смешать остатки напитков обоих напарников в один шот и выпить залпом.
- «Смена курса»: Заказать самый дешёвый/невкусный напиток в меню и выпить не поморщившись.
- «Громкая связь»: Позвонить последнему в списке вызовов и пропеть припев любой песни.
- «Иностранный легион»: До конца следующего уровня говорить только с вымышленным акцентом (французским, кавказским, робо-голосом). Забыл — штрафной шот.
- «Сторис позора»: Выложить селфи с самым неудачным ракурсом с подписью: «Мама, я в порядке, я с Штурманом».
- Если не сделал фото за 5 минут — заказываешь следующий круг напитков.

КОДЕКС ЧЕСТИ СОБУТЫЛЬНИКА (обязательно добавь в конце плана):
📜 КОДЕКС ЧЕСТИ СОБУТЫЛЬНИКА:
1. Принцип «Слово Дамы/Джентльмена»: Если объект «Мирных переговоров» сказал «Нет» — миссия провалена. Отступаем красиво, без нытья и агрессии.
2. Вето на политику и религию: В состоянии «Кандидат наук» эти темы — кратчайший путь к «Научному диспуту» на кулаках. Начавший — оплачивает штрафной круг.
3. Не трогай персонал: Официант и бармен — твои лучшие друзья и провайдеры топлива. Хамство = дезертирство.
4. Свой своих не бросает: Если напарник перешёл в режим «Горизонтального атлета» — доставь его в безопасную гавань. Бросить собутыльника — позор на семь поколений.
5. Чистое небо: Веселимся так, чтобы не мешать тем, кто уже «в домике». Уважаем чужой сон.

ПРАВИЛА АДАПТАЦИИ ПОД НОРМУ:
- Если один из участников "Лайт" — миссии более культурные, меньше алкоголя, больше креатива и интеллекта в заданиях.
- Если оба "Штурманы" — средний уровень безумия, баланс между треш-заданиями и цивильными.
- Если оба "Кандидаты наук" или "Мастера спорта" — МАКСИМАЛЬНЫЙ УГАР, самые безумные и эпичные миссии.
- Учитывай общие интересы и напитки обоих участников при генерации миссий.

ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ:
- Пиши на русском языке.
- НЕ используй markdown форматирование (без **, ##, и т.д.), пиши простым текстом.
- Используй эмодзи для оформления.
- Каждая миссия должна быть выполнимой в реальности (без опасности для здоровья и закона).
- КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО упоминать Россию, российские законы (УК РФ, КоАП РФ и т.д.), российские госструктуры (ФСБ, МВД России, Росгвардия и т.п.), российскую политику и любые реалии, связанные с РФ. Приложение международное — контент должен быть универсальным и нейтральным.`;

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
