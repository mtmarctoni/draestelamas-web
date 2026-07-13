import type { TranslationContent } from "../types";

const ca: TranslationContent = {
  meta: {
    title: "Dra. Estela Mas",
    description:
      "Dra. Estela Mas — cardiòloga i pionera en salut digital i medicina cardio-renal. Clínica i recerca a Barcelona.",
  },
  nav: {
    about: "Sobre",
    cardiorenal: "Cardio-renal",
    digitalHealth: "Salut digital",
    gallery: "Galeria",
    collaborations: "Col·laboracions",
    contact: "Contacte",
  },
  hero: {
    label: "Cardiologia · Salut Digital",
    title: "Dra. Estela Mas",
    subtitle: "Cardiòloga",
    cta: "Coneix la trajectòria",
  },
  about: {
    label: "Sobre",
    title: "Trajectòria i vocació",
    body: "<p>Amb més de 30 anys d'experiència en cardiologia, la Dra. Estela Mas ha dedicat la seva carrera a la intersecció entre la innovació tecnològica i l'atenció al pacient.</p><p>Pionera en la implementació de solucions de salut digital a Espanya, ha liderat projectes que han transformat la manera en què es diagnostiquen i tracten les malalties cardiovasculars.</p><p>La seva recerca se centra en la connexió entre la salut renal i la salut cardiovascular, un camp que requereix una atenció interdiscolinar i un enfocament personalitzat per a cada pacient.</p>",
  },
  cardiorenal: {
    label: "Cardio-renal",
    title: "El cor i el rinyó: una connexió vital",
    intro:
      "La relació entre el cor i el rinyó és una de les més complexes de la medicina. La malaltia cardiovascular és la primera causa de mortalitat en pacients amb malaltia renal crònica, i la disfunció renal accelerada en pacients amb insuficiència cardíaca.",
    posts: [
      {
        id: "prevencion",
        title: "Prevenció de la malaltia renal",
        excerpt:
          "El riñón florito: estratègies per mantenir la salut renal i prevenir l'avanç de la malaltia.",
        image: "/assets/img/galeria-01.jpg",
        href: "/blog/salud-renal-prevencion-enfermedad-renal",
      },
    ],
  },
  digitalHealth: {
    label: "Salut digital",
    title: "Innovació al servei del pacient",
    items: [
      {
        title: "Telemedicina",
        description:
          "Consultes remotes que permeten un seguiment continu del pacient sense necessitat de desplaçament.",
        icon: "telemedicine",
      },
      {
        title: "Inteligència Artificial",
        description:
          "Algoritmes predictius que ajuden a identificar pacients en risc abans que la malaltia progressi.",
        icon: "ai",
      },
      {
        title: "Wearables",
        description:
          "Dispositius connectats que monitoritzen els signes vitals en temps real i envien alertes al metge.",
        icon: "wearables",
      },
    ],
  },
  gallery: {
    label: "Galeria",
    title: "Espai de treball i recerca",
    items: [
      {
        id: "obra-01",
        title: "Laboratori de recerca",
        medium: "Investigació cardiovascular",
        technique: "Recerca traslacional",
        description: "Espai dedicat a la recerca cardiovascular i la innovació en salut digital.",
        image: "/assets/img/galeria-01.jpg",
        fullImage: "/assets/img/obra-01.jpg",
      },
      {
        id: "obra-02",
        title: "Consulta cardiologica",
        medium: "Atenció al pacient",
        technique: "Cardiologia clínica",
        description: "Espai de consulta dedicat a l'atenció cardiologica personalitzada.",
        image: "/assets/img/galeria-02.jpg",
        fullImage: "/assets/img/obra-02.jpg",
      },
      {
        id: "obra-03",
        title: "Congrés internacional",
        medium: "Presentació científica",
        technique: "Recerca clínica",
        description: "Presentació de resultats de recerca cardiovascular en congressos internacionals.",
        image: "/assets/img/galeria-03.jpg",
        fullImage: "/assets/img/obra-03.jpg",
      },
      {
        id: "obra-04",
        title: "Equip multidisciplinari",
        medium: "Col·laboració",
        technique: "Treball en equip",
        description: "Treball conjunt amb professionals de diverses especialitats per a l'atenció integral del pacient.",
        image: "/assets/img/galeria-04.jpg",
        fullImage: "/assets/img/obra-04.jpg",
      },
      {
        id: "obra-05",
        title: "Innovació tecnològica",
        medium: "Salut digital",
        technique: "Tecnologia mèdica",
        description: "Implementació de solucions tecnològiques per millorar l'atenció sanitària.",
        image: "/assets/img/galeria-05.jpg",
        fullImage: "/assets/img/obra-05.jpg",
      },
    ],
  },
  collaborations: {
    label: "Col·laboracions",
    title: "Xarxa de col·laboració",
    items: [
      {
        name: "Sociedad Española de Cardiología",
        description: "Societat científica de referència en cardiologia a Espanya.",
      },
      {
        name: "Fundació la Caixa",
        description: "Projectes de recerca i innovació en salut digital.",
      },
      {
        name: "Hospital Clínic de Barcelona",
        description: "Centre de recerca i atenció cardiologica d'alt nivell.",
      },
    ],
  },
  contact: {
    label: "Contacte",
    title: "Posa't en contacte",
    description:
      "Si desitges més informació o volem una consulta, pots contactar-me directament. Estaré encantada d'atendre't.",
    form: {
      name: "Nom",
      surname: "Cognoms",
      email: "Correu electrònic",
      message: "Missatge",
      submit: "Enviar",
      sending: "Enviant...",
      success: "Missatge enviat correctament. Et contactaré aviat.",
      error: "Hi ha hagut un error. Si us plau, torna-ho a intentar.",
      honeypotLabel: "Deixa aquest camp buit",
    },
  },
  footer: {
    copyright: "© 2026 Dra. Estela Mas. Tots els drets reservats.",
    privacy: "Política de privacitat",
    legal: "Avís legal",
  },
  legal: {
    privacy: {
      title: "Política de privacitat",
      sections: [
        {
          title: "1. Informació responsable",
          content:
            "En compliment delarticle 13 del Reglament (UE) 2016/679 del Parlament Europeu i del Consell, us informem que les dades personals que ens facilite seran tractades per Dra. Estela Mas, amb NIF [NIF], i domicili a [domicili], com a responsable del tractament.",
        },
        {
          title: "2. Finalitat del tractament",
          content:
            "Les dades personals que ens proporcioneu a través del formulari de contacte seran tractades amb la finalitat de gestionar la vostra consulta o sol·licitud d'informació.",
        },
        {
          title: "3. Legitimació del tractament",
          content:
            "La base legal per al tractament de les vostres dades és el consentiment exprés que ens proporcioneu en enviar el formulari de contacte.",
        },
        {
          title: "4. Conservació de les dades",
          content:
            "Les vostres dades personals seran conservades durant el temps necessari per gestionar la vostra consulta i, posteriorment, durant els terminis legals aplicables.",
        },
        {
          title: "5. Comunicació de les dades",
          content:
            "No es previ la transferència internacional de dades. Les dades seran tractades exclusivament per Dra. Estela Mas.",
        },
        {
          title: "6. Servei d'enviament de correu electrònic",
          content:
            "Utilitzem Resend, un servei de l'empresa Resend, Inc., per gestionar l'enviament de correus electrònics. Les vostres dades (nom, cognoms i correu electrònic) seran compartides amb Resend, Inc., amb seu als Estats Units, en virtut del seu adhesió al EU-U.S. Data Privacy Framework, que garanteix un nivell adequat de protecció de dades. Podeu consultar la seva política de privacitat a https://resend.com/legal/privacy-policy.",
        },
        {
          title: "7. Exercici de drets",
          content:
            "Podeu exercir els vostres drets d'accés, rectificació, supressió, oposició, limitació i portabilitat de les dades personals enviant un correu electrònic a [correu electrònic] adjuntant una còpia del vostre DNI o document identificatiu equivalent.",
        },
        {
          title: "8. Cookies",
          content:
            "Aquest web no utilitza cookies de rastreig ni cookies analítiques. Únicament s'utilitzen cookies tècniques estrictament necessaries per al funcionament de la web, les quals no requereixen el vostre consentiment.",
        },
      ],
    },
    legal: {
      title: "Avís legal",
      sections: [
        {
          title: "1. Informació general",
          content:
            "En compliment de l'article 10 de la Llei 34/2002, d'11 de juliol, de Serveis de la Societat de la Informació i de Comerç Electrònic, us informem que aquest web és titularitat de Dra. Estela Mas, amb NIF [NIF] i domicili a [domicili].",
        },
        {
          title: "2. Propietat intel·lectual",
          content:
            "Tot el contingut d'aquest web, incloent-hi textos, imatges, dissenys, gràfics, logos, programari i qualsevol altre material, està protegit per les lleis de propietat intel·lectual i industrial. Qualsevol reproducció, distribució, comunicació pública o transformació d'aquest contingut sense l'autorització expressa de Dra. Estela Mas està prohibida.",
        },
        {
          title: "3. Responsabilitat",
          content:
            "Dra. Estela Mas no es fa responsable de qualsevol dany o perjudici que pugui derivar-se de l'ús indegut d'aquest web ni dels continguts o serveis enllaçats des d'aquest.",
        },
        {
          title: "4. Enllaços",
          content:
            "Aquest web pot contenir enllaços a llocs web de tercers. Dra. Estela Mas no assumeix cap responsabilitat pel contingut o les pràctiques de privacitat d'aquests llocs web de tercers.",
        },
        {
          title: "5. Protecció de dades",
          content:
            "Per a informació sobre el tractament de les vostres dades personals, consulteu la nostra Política de Privacitat.",
        },
      ],
    },
  },
  blog: {
    readMore: "Llegir més",
    backToHome: "Tornar a l'inici",
    publishedOn: "Publicat el",
  },
};

export default ca;
