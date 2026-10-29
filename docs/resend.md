# Confirmation emails with Resend

When someone sends a message or a brief on the site, they get a short confirmation by email:

- the subject is "I have your message" (or "build brief" / "hire brief");
- it's sent from **adam@aadambuilds.dev**;
- replies come back to the same address.

The site already does this. It only needs a Resend account, the domain verified, and two settings in Vercel. Your own notifications still arrive on Telegram.

About 15 minutes, most of it waiting for DNS.

## 1. Create the Resend account
1. Sign up at **resend.com** (free tier: 3,000 emails a month, 100 a day).
2. Go to **Domains → Add Domain**. Enter `aadambuilds.dev` and pick region **Ireland (eu-west-1)**, the closest to Accra and to the database.

Resend then shows the exact DNS records for the domain. Keep that page open.

## 2. Add the DNS records at Namecheap
The domain's DNS is at Namecheap (nameservers `dns1/dns2.registrar-servers.com`).

Go to **Namecheap → Domain List → aadambuilds.dev → Manage → Advanced DNS → Add New Record**. Add each record exactly as Resend shows it. They look like this:

| Type | Host | Value | Notes |
|---|---|---|---|
| TXT | `resend._domainkey` | `p=MIGfMA0GCSq…` (long key from Resend) | DKIM, proves the mail is yours |
| MX | `send` | `feedback-smtp.eu-west-1.amazonses.com`, priority `10` | bounce handling, only on the `send` subdomain |
| TXT | `send` | `v=spf1 include:amazonses.com ~all` | SPF for the `send` subdomain |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:adam@aadambuilds.dev` | optional but recommended |

Things to get right:
- **Host is just the part before the domain.** Namecheap adds `aadambuilds.dev` itself. Type `send`, not `send.aadambuilds.dev`.
- **Namecheap puts MX records in the "Mail Settings" section**, which must be set to **Custom MX** before you can add the `send` MX. If you also set up forwarding (step 5), see the note there.
- **Leave TTL on Automatic.**

Back in Resend, press **Verify DNS records**. It usually turns green within 5–30 minutes, and occasionally takes a few hours.

## 3. Create an API key
Go to **Resend → API Keys → Create API Key**:
- name: `aadambuilds.dev site`
- permission: **Sending access**
- domain: `aadambuilds.dev`

Copy the key (`re_…`). It is shown once.

## 4. Add two settings in Vercel
Go to **Vercel → project aadamdev → Settings → Environment Variables**. Add both for **Preview** and **Production**:

| Name | Value |
|---|---|
| `RESEND_API_KEY` | the `re_…` key (type: Sensitive) |
| `INQUIRY_FROM` | `Aadam <adam@aadambuilds.dev>` |

Then redeploy: **Deployments → latest → Redeploy**. Settings only reach a deployment that starts after they are saved.

## 5. Receive mail at adam@aadambuilds.dev
Resend only sends. To read replies, forward the address to your Gmail with Namecheap's free forwarding:

1. Go to **Namecheap → aadambuilds.dev → Manage → Redirect Email** (or **Mail Settings → Email Forwarding**).
2. Add an alias `adam` forwarding to `aadamsays@gmail.com`.
3. Namecheap adds its own MX records on `@` (the root) for forwarding. These do **not** clash with Resend's MX on `send`, because they are different hosts.
4. If Mail Settings asks you to choose between "Email Forwarding" and "Custom MX", choose **Email Forwarding**, then add the `send` MX under Advanced DNS.
   - If Namecheap won't allow an MX there in forwarding mode, add it as **Custom MX** with both sets: Namecheap's forwarding MX on `@` and Resend's on `send`.

To **send** as adam@ from Gmail later, use Gmail → Settings → Accounts → "Send mail as" with Resend's SMTP (`smtp.resend.com`, port 465, user `resend`, password = an API key).

## 6. Test it
1. Open the preview, go to **Start a project**, and send a message with your own email address as the contact.
2. Within a few seconds:
   - Telegram shows the message;
   - the Office shows it under Leads;
   - your inbox has "I have your message" from adam@aadambuilds.dev.
3. In **Resend → Emails** the send shows as **Delivered**. A "Bounced" or "Complained" status says why.

The Office **Settings** checklist shows "Email confirmations: on" once `RESEND_API_KEY` is set.

## Troubleshooting
- **No email at all.** Check that `RESEND_API_KEY` is set for the environment you're testing (Preview vs Production), and that you redeployed after adding it. Vercel → Deployment → Runtime Logs will show `resend 4xx` if the key is wrong.
- **"Domain not verified" (403 from Resend).** DNS isn't live yet, or a host was entered with the domain twice (`send.aadambuilds.dev.aadambuilds.dev`). Use `dig TXT resend._domainkey.aadambuilds.dev` to check.
- **Lands in spam.** Add the DMARC record, keep `p=none` for the first weeks, and send from the verified address only. The confirmation is short plain text plus a button, which inbox filters like.
- **The visitor gave a WhatsApp number, not an email.** No email is sent. That's expected; only addresses containing `@` get one.
- **Change the wording.** Edit `src/app/api/inquiry/route.ts` (title and intro). The layout lives in `src/lib/office/mail.ts`. The text is fixed on purpose: the form must never email arbitrary text to arbitrary addresses.
