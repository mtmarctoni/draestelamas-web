import type { TranslationContent } from "../types";

const en: TranslationContent = {
  meta: {
    title: "Dr. Estela Mas",
    description:
      "Dr. Estela Mas — cardiologist and pioneer in digital health and cardio-renal medicine. Clinical practice and research in Barcelona.",
  },
  nav: {
    about: "About",
    cardiorenal: "Cardio-renal",
    digitalHealth: "Digital health",
    gallery: "Gallery",
    collaborations: "Collaborations",
    contact: "Contact",
  },
  hero: {
    label: "Cardiology · Digital Health",
    title: "Dr. Estela Mas",
    subtitle: "Cardiologist",
    cta: "Learn about the trajectory",
  },
  about: {
    label: "About",
    title: "Career and vocation",
    body: "<p>With over 30 years of experience in cardiology, Dr. Estela Mas has dedicated her career to the intersection between technological innovation and patient care.</p><p>A pioneer in implementing digital health solutions in Spain, she has led projects that have transformed the way cardiovascular diseases are diagnosed and treated.</p><p>Her research focuses on the connection between renal health and cardiovascular health, a field that requires interdisciplinary attention and a personalized approach for each patient.</p>",
  },
  cardiorenal: {
    label: "Cardio-renal",
    title: "The heart and kidney: a vital connection",
    intro:
      "The relationship between the heart and kidney is one of the most complex in medicine. Cardiovascular disease is the leading cause of mortality in patients with chronic kidney disease, and accelerated renal dysfunction in patients with heart failure.",
    posts: [
      {
        id: "prevencion",
        title: "Prevention of kidney disease",
        excerpt:
          "The flowering kidney: strategies to maintain renal health and prevent disease progression.",
        image: "/assets/img/galeria-01.jpg",
        href: "/blog/salud-renal-prevencion-enfermedad-renal",
      },
    ],
  },
  digitalHealth: {
    label: "Digital health",
    title: "Innovation at the service of the patient",
    items: [
      {
        title: "Telemedicine",
        description:
          "Remote consultations that allow continuous patient monitoring without the need for travel.",
        icon: "telemedicine",
      },
      {
        title: "Artificial Intelligence",
        description:
          "Predictive algorithms that help identify at-risk patients before the disease progresses.",
        icon: "ai",
      },
      {
        title: "Wearables",
        description:
          "Connected devices that monitor vital signs in real time and send alerts to the physician.",
        icon: "wearables",
      },
    ],
  },
  gallery: {
    label: "Gallery",
    title: "Work and research space",
    items: [
      {
        id: "obra-01",
        title: "Research laboratory",
        medium: "Cardiovascular research",
        technique: "Translational research",
        description: "Space dedicated to cardiovascular research and digital health innovation.",
        image: "/assets/img/galeria-01.jpg",
        fullImage: "/assets/img/obra-01.jpg",
      },
      {
        id: "obra-02",
        title: "Cardiology consultation",
        medium: "Patient care",
        technique: "Clinical cardiology",
        description: "Consultation space dedicated to personalized cardiology care.",
        image: "/assets/img/galeria-02.jpg",
        fullImage: "/assets/img/obra-02.jpg",
      },
      {
        id: "obra-03",
        title: "International congress",
        medium: "Scientific presentation",
        technique: "Clinical research",
        description: "Presentation of cardiovascular research results at international congresses.",
        image: "/assets/img/galeria-03.jpg",
        fullImage: "/assets/img/obra-03.jpg",
      },
      {
        id: "obra-04",
        title: "Multidisciplinary team",
        medium: "Collaboration",
        technique: "Teamwork",
        description: "Joint work with professionals from various specialties for comprehensive patient care.",
        image: "/assets/img/galeria-04.jpg",
        fullImage: "/assets/img/obra-04.jpg",
      },
      {
        id: "obra-05",
        title: "Technological innovation",
        medium: "Digital health",
        technique: "Medical technology",
        description: "Implementation of technological solutions to improve healthcare.",
        image: "/assets/img/galeria-05.jpg",
        fullImage: "/assets/img/obra-05.jpg",
      },
    ],
  },
  collaborations: {
    label: "Collaborations",
    title: "Collaboration network",
    items: [
      {
        name: "Spanish Society of Cardiology",
        description: "Reference scientific society in cardiology in Spain.",
      },
      {
        name: "la Caixa Foundation",
        description: "Research and innovation projects in digital health.",
      },
      {
        name: "Hospital Clínic de Barcelona",
        description: "High-level research and cardiology care center.",
      },
    ],
  },
  contact: {
    label: "Contact",
    title: "Get in touch",
    description:
      "If you would like more information or have a consultation, you can contact me directly. I will be happy to assist you.",
    form: {
      name: "Name",
      surname: "Surnames",
      email: "Email",
      message: "Message",
      submit: "Send",
      sending: "Sending...",
      success: "Message sent successfully. I will contact you soon.",
      error: "An error occurred. Please try again.",
      honeypotLabel: "Leave this field empty",
    },
  },
  footer: {
    copyright: "© 2026 Dr. Estela Mas. All rights reserved.",
    privacy: "Privacy policy",
    legal: "Legal notice",
  },
  legal: {
    privacy: {
      title: "Privacy policy",
      sections: [
        {
          title: "1. Controller information",
          content:
            "In compliance with Article 13 of Regulation (EU) 2016/679 of the European Parliament and of the Council, we inform you that the personal data you provide will be processed by Dr. Estela Mas, with ID [ID], and address [address], as the data controller.",
        },
        {
          title: "2. Purpose of processing",
          content:
            "The personal data you provide through the contact form will be processed for the purpose of managing your inquiry or information request.",
        },
        {
          title: "3. Legal basis for processing",
          content:
            "The legal basis for processing your data is the express consent you provide when sending the contact form.",
        },
        {
          title: "4. Data retention",
          content:
            "Your personal data will be retained for the time necessary to manage your inquiry and, subsequently, for the applicable legal periods.",
        },
        {
          title: "5. Data communication",
          content:
            "International data transfer is not planned. Data will be processed exclusively by Dr. Estela Mas.",
        },
        {
          title: "6. Email service provider",
          content:
            "We use Resend, a service provided by Resend, Inc., to manage the sending of emails. Your data (name, surnames, and email) will be shared with Resend, Inc., based in the United States, under its adherence to the EU-U.S. Data Privacy Framework, which guarantees an adequate level of data protection. You can consult their privacy policy at https://resend.com/legal/privacy-policy.",
        },
        {
          title: "7. Exercise of rights",
          content:
            "You can exercise your rights of access, rectification, deletion, opposition, limitation, and portability of personal data by sending an email to [email address] attaching a copy of your ID card or equivalent identification document.",
        },
        {
          title: "8. Cookies",
          content:
            "This website does not use tracking cookies or analytical cookies. Only strictly necessary technical cookies are used for the operation of the website, which do not require your consent.",
        },
      ],
    },
    legal: {
      title: "Legal notice",
      sections: [
        {
          title: "1. General information",
          content:
            "In compliance with Article 10 of Law 34/2002, of July 11, on Information Society Services and Electronic Commerce, we inform you that this website is owned by Dr. Estela Mas, with ID [ID] and address [address].",
        },
        {
          title: "2. Intellectual property",
          content:
            "All content on this website, including texts, images, designs, graphics, logos, software, and any other material, is protected by intellectual and industrial property laws. Any reproduction, distribution, public communication, or transformation of this content without the express authorization of Dr. Estela Mas is prohibited.",
        },
        {
          title: "3. Liability",
          content:
            "Dr. Estela Mas assumes no liability for any damage that may result from the misuse of this website or its linked contents and services.",
        },
        {
          title: "4. Links",
          content:
            "This website may contain links to third-party websites. Dr. Estela Mas assumes no responsibility for the content or privacy practices of these third-party websites.",
        },
        {
          title: "5. Data protection",
          content:
            "For information about the processing of your personal data, please consult our Privacy Policy.",
        },
      ],
    },
  },
  blog: {
    readMore: "Read more",
    backToHome: "Back to home",
    publishedOn: "Published on",
  },
};

export default en;
