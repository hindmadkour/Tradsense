import { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

type Role = "user" | "assistant";

interface ChatMessage {
  role: Role;
  content: string;
}

const getQuickReplies = (language: string) => {
  if (language === "ar") {
    return [
      "كيف أبدأ التحدي؟",
      "ما هي الأسعار؟",
      "ما هي القواعد؟",
      "هل توجد تجربة مجانية؟",
      "ما طرق الدفع المتاحة؟",
      "كيف اغير خطتي؟",
      "كيف اعيد تعيين كلمة المرور؟",
      "كيف يتم السحب؟",
      "هل يوجد دعم مباشر؟",
      "اريد التواصل مع المبيعات",
    ];
  }
  if (language === "en") {
    return [
      "How do I start?",
      "What are the prices?",
      "What are the rules?",
      "Do you offer a free trial?",
      "What payment methods do you support?",
      "How do I change my plan?",
      "How do I reset my password?",
      "How do withdrawals work?",
      "Is live support available?",
      "I want to contact sales",
    ];
  }
  return [
    "Comment demarrer ?",
    "Quels sont les tarifs ?",
    "Quelles sont les regles ?",
    "Proposez-vous un essai gratuit ?",
    "Quels moyens de paiement ?",
    "Comment changer de plan ?",
    "Comment reinitialiser mon mot de passe ?",
    "Comment fonctionnent les retraits ?",
    "Y a-t-il un support en direct ?",
    "Je veux contacter les ventes",
  ];
};

const getQuickReplyResponses = (language: string) => {
  if (language === "ar") {
    return {
      "كيف أبدأ التحدي؟":
        "ابدأ بإنشاء حساب، ثم اختر الخطة، وبعدها أكمل الدفع للوصول إلى لوحة التحكم. هل تريد رابط التسجيل؟",
      "ما هي الأسعار؟":
        "الأسعار تختلف حسب الخطة والمزايا. أخبرني بحجم الحساب أو المدة لأقترح لك الأنسب.",
      "ما هي القواعد؟":
        "القواعد تشمل حدود السحب وإدارة المخاطر ومعايير التقييم. هل تريد ملخصًا سريعًا أم التفاصيل؟",
      "هل توجد تجربة مجانية؟":
        "نعم، يمكننا تفعيل تجربة محدودة حسب الخطة. ماذا تريد تجربته بالتحديد؟",
      "ما طرق الدفع المتاحة؟":
        "نقبل عادة بطاقات بنكية وطرق دفع إلكترونية حسب البلد. أخبرني ببلدك لأؤكد الخيارات.",
      "كيف اغير خطتي؟":
        "يمكنك ترقية أو تخفيض الخطة من صفحة الاشتراك. هل تريد المساعدة؟",
      "كيف اعيد تعيين كلمة المرور؟":
        "استخدم خيار \"نسيت كلمة المرور\" في صفحة تسجيل الدخول. هل تريد الرابط؟",
      "كيف يتم السحب؟":
        "السحب يتم وفق القواعد وحدود السحب الخاصة بالخطة. هل تريد شرحًا مختصرًا؟",
      "هل يوجد دعم مباشر؟":
        "نعم، يوجد دعم عبر الدردشة والبريد. أخبرني بمشكلتك وسأساعدك.",
      "اريد التواصل مع المبيعات":
        "أكيد. ارسل لي بريدك والبلد وسيتواصل معك فريق المبيعات.",
    };
  }
  if (language === "en") {
    return {
      "How do I start?":
        "Create an account, pick a plan, and complete checkout to access the dashboard. Want the signup link?",
      "What are the prices?":
        "Pricing depends on the plan and features. Tell me the account size or duration you want.",
      "What are the rules?":
        "Key rules include drawdown limits, risk management, and evaluation criteria. Want a quick summary or the full list?",
      "Do you offer a free trial?":
        "Yes, we can enable a limited trial depending on the plan. Tell me what you want to test.",
      "What payment methods do you support?":
        "We typically support cards and popular online methods depending on your country. Tell me your location to confirm.",
      "How do I change my plan?":
        "You can upgrade or downgrade in the subscription page. Need help?",
      "How do I reset my password?":
        "Use the \"Forgot password\" link on the login page. Want the link?",
      "How do withdrawals work?":
        "Withdrawals follow the rules and limits for your plan. Want a quick summary?",
      "Is live support available?":
        "Yes, we offer chat and email support. Tell me what you need help with.",
      "I want to contact sales":
        "Sure. Share your email and country and sales will reach out.",
    };
  }
  return {
    "Comment demarrer ?":
      "Creez un compte, choisissez une offre, puis finalisez le paiement pour acceder au tableau de bord. Voulez-vous le lien ?",
    "Quels sont les tarifs ?":
      "Les tarifs dependent du plan et des fonctionnalites. Dites-moi la taille du compte ou la duree souhaitee.",
    "Quelles sont les regles ?":
      "Les regles couvrent le drawdown, la gestion du risque et les criteres d'evaluation. Voulez-vous un resume ou le detail ?",
    "Proposez-vous un essai gratuit ?":
      "Oui, nous pouvons activer un essai limite selon le plan. Que voulez-vous tester ?",
    "Quels moyens de paiement ?":
      "Nous acceptons generalement les cartes et des moyens en ligne selon le pays. Dites-moi votre pays pour confirmer.",
    "Comment changer de plan ?":
      "Vous pouvez changer de plan depuis la page abonnement. Besoin d'aide ?",
    "Comment reinitialiser mon mot de passe ?":
      "Utilisez le lien \"Mot de passe oublie\" sur la page de connexion. Voulez-vous le lien ?",
    "Comment fonctionnent les retraits ?":
      "Les retraits suivent les regles et les limites de votre plan. Voulez-vous un resume ?",
    "Y a-t-il un support en direct ?":
      "Oui, support via chat et email. Dites-moi votre besoin et je vous guide.",
    "Je veux contacter les ventes":
      "D'accord. Donnez-moi votre email et votre pays, l'equipe ventes vous contacte.",
  };
};

const getGreeting = (language: string) => {
  if (language === "ar") {
    return "مرحبا! كيف يمكنني مساعدتك اليوم؟";
  }
  if (language === "en") {
    return "Hi! How can I help you today?";
  }
  return "Bonjour ! Comment puis-je vous aider aujourd'hui ?";
};

const GrokChatWidget = () => {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: getGreeting(language) },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setMessages([{ role: "assistant", content: getGreeting(language) }]);
  }, [language]);

  useEffect(() => {
    if (!isOpen) return;
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
    });
  }, [isOpen, messages]);

  const quickReplies = useMemo(() => getQuickReplies(language), [language]);
  const quickReplyResponses = useMemo(
    () => getQuickReplyResponses(language),
    [language],
  );

  const sendMessage = async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || isSending) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages(nextMessages);
    setInput("");
    setError(null);

    const instantReply = quickReplyResponses[trimmed];
    if (instantReply) {
      setMessages((prev) => [...prev, { role: "assistant", content: instantReply }]);
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch(`${API_BASE_URL}/chat/grok`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          model: "grok-4-latest",
          temperature: 0.3,
        }),
      });
      if (!response.ok) {
        throw new Error("chat_failed");
      }
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply ?? "" },
      ]);
    } catch (err) {
      setError(t("chat_error"));
    } finally {
      setIsSending(false);
    }
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    void sendMessage(input);
  };

  const direction = language === "ar" ? "rtl" : "ltr";

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="group relative flex items-center gap-2 rounded-full border border-border/60 bg-card/80 px-4 py-3 shadow-[0_20px_50px_-25px_rgba(15,23,42,0.6)] backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-primary/40"
        aria-label={isOpen ? t("chat_close") : t("chat_open")}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#7b1e2b] text-white shadow-lg shadow-primary/30">
          <MessageCircle className="h-5 w-5" />
        </span>
        <span className="hidden text-sm font-semibold text-foreground sm:inline">
          {t("chat_title")}
        </span>
        <span className="hidden text-xs text-muted-foreground sm:inline">
          {t("chat_subtitle")}
        </span>
      </button>

      {isOpen && (
        <div
          className="mt-4 w-[320px] max-w-[calc(100vw-3rem)] overflow-hidden rounded-3xl border border-border/60 bg-card/95 shadow-[0_26px_60px_-34px_rgba(15,23,42,0.7)] backdrop-blur-2xl sm:w-[360px]"
          dir={direction}
        >
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
            <div>
              <p className="text-sm font-semibold">{t("chat_title")}</p>
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground">{t("chat_subtitle")}</p>
                <span className="rounded-full bg-secondary text-secondary-foreground px-2.5 py-0.5 text-xs font-semibold">
                  Gemini
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={t("chat_close")}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div
            ref={listRef}
            className="flex max-h-[320px] flex-col gap-3 overflow-y-auto px-4 py-4"
          >
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed shadow-sm ${
                    message.role === "user"
                      ? "bg-primary text-white shadow-primary/20"
                      : "bg-background/80 text-foreground"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isSending && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-background/80 px-4 py-2 text-sm text-muted-foreground">
                  {t("chat_thinking")}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 px-4 pb-3">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                type="button"
                onClick={() => void sendMessage(reply)}
                className="rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                {reply}
              </button>
            ))}
          </div>

          {error && <div className="px-4 pb-2 text-xs text-destructive">{error}</div>}

          <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-border/60 px-4 py-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={t("chat_placeholder")}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <Button type="submit" size="icon" variant="hero" disabled={isSending || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default GrokChatWidget;
