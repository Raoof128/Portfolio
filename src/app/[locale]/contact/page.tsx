import type { Metadata } from "next"
import { ContactClient } from "./ContactClient"

export const metadata: Metadata = {
  title: "Contact | Mohammad Raouf Abedini",
  description: "Get in touch with Mohammad Raouf Abedini. Open a secure communication channel for cybersecurity consultations, collaborations, or inquiries.",
  openGraph: {
    title: "Contact | Mohammad Raouf Abedini",
    description: "Get in touch with Mohammad Raouf Abedini. Open a secure communication channel for cybersecurity consultations, collaborations, or inquiries.",
  },
}

export default function ContactPage() {
  return <ContactClient />
}
