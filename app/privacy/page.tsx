import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal/LegalPage';

export const metadata: Metadata = {
  title: 'Privacy Policy — Kidai',
  description: 'How Kidai handles your data.',
};

const LAST_UPDATED = 'May 15, 2026';

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated={LAST_UPDATED}>
      <p>
        Kidai (&ldquo;we&rdquo;, &ldquo;us&rdquo;) provides a parenting guidance app and website. This policy
        explains what information we collect, how we use it, and the choices you have.
      </p>

      <h2>Summary</h2>
      <ul>
        <li>Your family&rsquo;s moments — recordings, transcripts, and saved history — are stored locally on your device.</li>
        <li>When you describe a moment, the audio transcript and the context you provide are sent to our AI provider to generate a response. Audio is not retained after transcription.</li>
        <li>We use Apple&rsquo;s App Store for billing. We never see your card details.</li>
        <li>We do not sell your data. We do not use it to train AI models.</li>
      </ul>

      <h2>Information We Process</h2>
      <h3>Information you provide</h3>
      <ul>
        <li>
          <strong>Voice recordings and transcripts.</strong> When you hold the mic and describe a moment, we transcribe your
          speech and send the text — together with the context you select — to our AI provider in order to produce
          guidance. Audio is processed transiently and not retained on our servers.
        </li>
        <li>
          <strong>Child profiles.</strong> Names or nicknames, ages, and any notes you add. These are stored on your device.
          We receive the age and any context you choose to include with a request, so the AI response is age-appropriate.
        </li>
        <li>
          <strong>History.</strong> Past moments and the guidance you received are stored on your device so you can review them.
        </li>
      </ul>

      <h3>Information collected automatically</h3>
      <ul>
        <li>
          <strong>Subscription status.</strong> Apple tells us whether your subscription is active so we can unlock features.
          We do not receive your payment details.
        </li>
        <li>
          <strong>Basic diagnostic data.</strong> Crash reports and aggregated usage counts (e.g., how many requests fail) to keep the app working.
          This data does not include the content of your recordings or transcripts.
        </li>
      </ul>

      <h2>How We Use Information</h2>
      <ul>
        <li>To generate the guidance you request.</li>
        <li>To deliver and improve the app, fix bugs, and prevent abuse.</li>
        <li>To process subscriptions through the App Store.</li>
        <li>To respond if you contact support.</li>
      </ul>

      <h2>Service Providers</h2>
      <p>
        We use third parties to operate the service. They process information only on our instructions and only as
        needed to do their job:
      </p>
      <ul>
        <li><strong>AI providers</strong> (e.g., OpenAI, Anthropic) — to transcribe speech and generate guidance text. Inputs are not used to train their models under our agreements.</li>
        <li><strong>Apple</strong> — for app distribution, subscriptions, and crash reporting.</li>
        <li><strong>Hosting and analytics providers</strong> — to run our servers and understand aggregate usage.</li>
      </ul>

      <h2>Children</h2>
      <p>
        Kidai is designed for parents and caregivers. The app is not directed to children under 13, and we do not knowingly
        collect personal information from children. Profiles you create about your own children stay on your device; we
        receive only the minimum context needed to produce guidance (such as age).
      </p>

      <h2>Your Choices</h2>
      <ul>
        <li><strong>Microphone access.</strong> You can revoke it at any time in iOS Settings. Without it, voice input is unavailable.</li>
        <li><strong>Delete history.</strong> Clear individual moments or all history from within the app. Because history is on your device, deleting it removes it.</li>
        <li><strong>Cancel your subscription.</strong> Manage it through your Apple ID in iOS Settings.</li>
        <li><strong>Access, correction, deletion.</strong> Email us at the address below and we&rsquo;ll respond within a reasonable time.</li>
      </ul>

      <h2>Retention</h2>
      <p>
        Recordings and transcripts you create are kept on your device until you delete them or uninstall the app. We retain
        diagnostic logs for a short rolling window for troubleshooting.
      </p>

      <h2>International Users</h2>
      <p>
        Our service providers may process data in the United States and other countries. By using Kidai you understand that
        your information may be transferred to and processed in jurisdictions with different data protection laws than your
        own.
      </p>

      <h2>Security</h2>
      <p>
        We use industry-standard safeguards including encryption in transit. No system is perfectly secure; we encourage you to
        protect your device with a passcode and current OS updates.
      </p>

      <h2>Changes</h2>
      <p>
        If we make material changes to this policy, we&rsquo;ll update the date at the top and, where appropriate, notify you
        in the app.
      </p>

      <h2>Contact</h2>
      <p>
        Questions or requests: <a href="mailto:privacy@kidai.app">privacy@kidai.app</a>.
      </p>
    </LegalPage>
  );
}
