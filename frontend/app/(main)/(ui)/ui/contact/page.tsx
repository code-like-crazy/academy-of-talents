import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <div className="space-y-10">
      <section className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Contact Us</h1>
        <p className="text-foreground/80 mx-auto max-w-3xl text-xl">
          Have questions or feedback? We'd love to hear from you!
        </p>
      </section>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card className="border-primary/20 bg-card p-6 shadow-md">
          <h2 className="mb-6 text-2xl font-semibold">Send Us a Message</h2>
          <form className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                placeholder="Your name"
                className="border-primary/20 bg-background"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                className="border-primary/20 bg-background"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="subject" className="block text-sm font-medium">
                Subject
              </label>
              <Input
                id="subject"
                placeholder="What's this about?"
                className="border-primary/20 bg-background"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="block text-sm font-medium">
                Message
              </label>
              <Textarea
                id="message"
                placeholder="Your message here..."
                className="border-primary/20 bg-background min-h-[150px]"
              />
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full">
              Send Message
            </Button>
          </form>
        </Card>

        <div className="space-y-8">
          <Card className="border-primary/20 bg-card p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Contact Information</h2>
            <div className="space-y-4">
              <ContactItem
                icon="📧"
                title="Email"
                detail="info@academyoftalents.com"
              />
              <ContactItem icon="📱" title="Phone" detail="+1 (555) 123-4567" />
              <ContactItem
                icon="📍"
                title="Address"
                detail="123 Virtual Lane, Digital City, Cyberspace 10101"
              />
            </div>
          </Card>

          <Card className="border-primary/20 bg-card p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Office Hours</h2>
            <div className="space-y-2">
              <p className="text-foreground/70">
                <span className="font-medium">Monday - Friday:</span> 9:00 AM -
                6:00 PM EST
              </p>
              <p className="text-foreground/70">
                <span className="font-medium">Saturday:</span> 10:00 AM - 4:00
                PM EST
              </p>
              <p className="text-foreground/70">
                <span className="font-medium">Sunday:</span> Closed
              </p>
            </div>
          </Card>

          <Card className="border-primary/20 bg-card p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Follow Us</h2>
            <div className="flex space-x-4">
              <SocialButton icon="𝕏" label="Twitter" />
              <SocialButton icon="f" label="Facebook" />
              <SocialButton icon="in" label="LinkedIn" />
              <SocialButton icon="📸" label="Instagram" />
            </div>
          </Card>
        </div>
      </div>

      <section className="bg-card rounded-xl p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-semibold">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <FaqItem
            question="How do I get started with Academy of Talents?"
            answer="Simply create an account and you'll have immediate access to both our Interactive and UI modes. You can start chatting with our AI student avatars right away!"
          />
          <FaqItem
            question="Is Academy of Talents free to use?"
            answer="We offer a free tier with limited access to our AI students. Premium subscriptions unlock additional features, avatars, and remove usage limits."
          />
          <FaqItem
            question="Can I use Academy of Talents for educational purposes?"
            answer="Absolutely! Many educators use our platform to supplement their teaching and provide students with additional learning resources."
          />
          <FaqItem
            question="How accurate is the information provided by the AI students?"
            answer="Our AI students are powered by advanced language models and are designed to provide accurate information. However, we always recommend verifying critical information from multiple sources."
          />
        </div>
      </section>
    </div>
  );
}

function ContactItem({
  icon,
  title,
  detail,
}: {
  icon: string;
  title: string;
  detail: string;
}) {
  return (
    <div className="flex items-start">
      <div className="mr-3 text-2xl">{icon}</div>
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-foreground/70">{detail}</p>
      </div>
    </div>
  );
}

function SocialButton({ icon, label }: { icon: string; label: string }) {
  return (
    <button
      className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-12 w-12 items-center justify-center rounded-full transition-colors"
      aria-label={label}
    >
      {icon}
    </button>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-primary/20 bg-background rounded-xl border p-6 shadow-sm">
      <h3 className="mb-2 text-lg font-medium">{question}</h3>
      <p className="text-foreground/70">{answer}</p>
    </div>
  );
}
