import type { TranslationContent } from "../types";

const ca: TranslationContent = {
  meta: {
    title: "Dra. Estela Mas | Nefròloga — Salut Cardiorenal",
    description:
      "Nefròloga especialista en salut cardiorenometabòlica. Prevenció del risc cardiovascular i consulta nefrològica online.",
  },
  nav: {
    homeLabel: "Inici",
    aboutLabel: "Sobre jo",
    blogLabel: "Salut Cardiorenal",
    blogPill: "Blog",
    digitalLabel: "Salut Digital i IA",
    galleryLabel: "Humanisme Mèdic",
    collaborationsHtml: "Col<span class='l-geminada'>·</span>laboracions",
    contactLabel: "Contacte",
  },
  hero: {
    eyebrowHtml:
      "Especialista en Nefrologia<br />Salut cardiorenometabòlica<br />Prevenció del risc cardiovascular",
    titleHtml:
      "Darrere de cada pacient,<br />hi ha una <em>obra d'art</em><br />irrepetible.",
    subtitle:
      "Nefròloga especialitzada en salut cardiorenometabòlica i prevenció del risc cardiovascular. Uneixo la medicina basada en l'evidència, la innovació en salut digital i IA, i una mirada humanista centrada en la persona.",
    ctaCollaborationsHtml: "Col<span class='l-geminada'>·</span>laboracions",
    ctaContact: "Contacte",
    imageAlt: "Obra d'art — dos ronyons amb paisatge de posta de sol",
  },
  about: {
    titleHtml: "Sobre <em>jo</em>",
    label: "Recerca, formació contínua i humanisme mèdic",
    tags: [
      { text: "Salut cardiorenometabòlica", accent: false },
      { text: "Risc cardiovascular", accent: false },
      { text: "Art renal", accent: true },
      { text: "Humanisme mèdic", accent: true },
    ],
    bioHtml: [
      "Soc <strong>nefròloga, investigadora i artista</strong>. La meva activitat se centra en l'<strong>atenció integral de les persones amb malaltia renal crònica, hipertensió arterial i síndrome cardiorenometabòlica</strong>, amb un enfocament orientat a la prevenció i a la medicina basada en l'evidència. La meva trajectòria professional combina l'activitat assistencial, la participació en recerca clínica i la formació continuada, amb un interès creixent per la <strong>salut digital, la intel·ligència artificial i la innovació en HealthTech</strong>.",
      "Compagino la meva activitat assistencial amb la formació contínua en innovació aplicada a la medicina i amb la divulgació científica, participant en xerrades i activitats formatives sobre prevenció cardiorenal, risc cardiovascular en la malaltia renal crònica i síndrome cardiorenometabòlica.",
      "Paral·lelament, he completat una formació de postgrau en <strong>artteràpia</strong>, una disciplina que ha enriquit la meva visió humanista de la medicina i que reforça la meva manera d'entendre l'atenció sanitària: <strong>rigorosa des del punt de vista científic, però també propera i centrada en la persona</strong>.",
      "He realitzat estades formatives a la <strong>Unitat Cardiorrenal de l'Hospital Puerta de Hierro</strong> (Madrid) i a la <strong>Mayo Clinic de Rochester</strong> (Estats Units), experiències que han ampliat la meva perspectiva clínica i científica.",
      "La meva vocació és contribuir a una medicina més <strong>preventiva, innovadora i humana</strong>, oferint una atenció basada en l'evidència i adaptada a les necessitats de cada persona.",
    ],
    trainingLabel: "Formació i activitat acadèmica",
    training: [
      "Llicenciada en Medicina per la Universitat Autònoma de Barcelona",
      "Especialista en Nefrologia per l'Hospital Universitari Son Espases",
      "Màster en Investigació Mèdica",
      "Formació en nutrició clínica",
      "Màster en Hemodiàlisi",
      "Màster en Maneig de Fluids i Electròlits",
      "Formació continuada en síndrome cardiorenometabòlica, lipidologia clínica, risc cardiovascular i cardionefrologia",
      "Autora de publicacions en revistes científiques nacionals i internacionals",
      "Idiomes: català, castellà i anglès",
    ],
    societiesLabel: "Societats científiques",
    societies: [
      "Sociedad Española de Nefrología (SEN)",
      "European Renal Association (ERA)",
      "American Society of Nephrology (ASN)",
      "International Society of Nephrology (ISN)",
      "Sociedad Española de Arteriosclerosis (SEA)",
      "Societat Balear de Nefrologia (SBN)",
    ],
    portraitAlt: "Dra. Estela Mas Ródenas, nefròloga",
  },
  blog: {
    eyebrow: "Blog · Articles de la doctora",
    titleHtml: "Salut <em>Cardiorenal</em>",
    back: "← Tornar",
  },
  digital: {
    titleHtml: "Salut Digital <em>i IA</em>",
    intro:
      "La salut digital i la intel·ligència artificial estan transformant la manera en què prevenim, diagnostiquem i fem el seguiment de les malalties cròniques. El meu interès se centra en com aquestes eines poden contribuir a millorar la prevenció cardiorenal, el control de la hipertensió, la malaltia renal crònica i la presa de decisions clíniques basada en dades. Actualment estic ampliant la meva formació en aquest àmbit i seguint de prop els avenços científics i tecnològics, amb l'objectiu d'integrar la innovació digital en la pràctica clínica i participar en projectes que millorin l'atenció a pacients i professionals.",
    areasLabel: "Àrees d'interès",
    areas: [
      "Monitorització remota de pacients",
      "Hipertensió i seguiment digital",
      "Prevenció cardiorenal",
      "Intel·ligència artificial aplicada a la pràctica clínica",
      "Suport a la presa de decisions clíniques",
      "Medicina personalitzada basada en dades",
    ],
  },
  gallery: {
    titleHtml: "Humanisme <em>Mèdic</em>",
    intro:
      "A través de l'art, exploro l'experiència humana de la malaltia renal i la seva repercussió en la vida de les persones. Aquest projecte neix de la voluntat d'apropar la medicina, la ciència i les humanitats, generant espais de reflexió, divulgació i sensibilització al voltant de la salut renal.",
    artworks: [
      {
        id: "obra-01",
        title: "El ronyó florit",
        medium: "Acrílic i pastel sobre paper",
        technique: "Acrílic sobre tela",
        description: "Un ronyó com a jardí interior: la vida que persisteix dins la malaltia.",
      },
      {
        id: "obra-02",
        title: "Ciència i paisatge",
        medium: "Llapis sobre paper",
        technique: "Llapis sobre paper",
        description: "La mirada científica i la dimensió humana de la medicina renal, retratades juntes.",
      },
      {
        id: "obra-03",
        title: "The Blooming Glomerulus",
        medium: "Oli sobre tela · Portada NDT, febrer 2026",
        technique: "Oli sobre tela · Portada NDT, febrer 2026",
        description:
          "Obra seleccionada com a portada de la revista Nephrology Dialysis Transplantation (Oxford University Press), febrer 2026.",
      },
      {
        id: "obra-04",
        title: "Ronyons al capvespre",
        medium: "Acrílic sobre tela",
        technique: "Acrílic sobre tela",
        description:
          "La posta de sol com a metàfora de la resiliència: la bellesa que existeix fins i tot en els moments difícils.",
      },
      {
        id: "obra-05",
        title: "Far interior",
        medium: "Oli sobre tela",
        technique: "Oli sobre tela",
        description:
          "El far simbolitza l'esperança, la guia i la resiliència davant la malaltia, mentre que el mar evoca la serenitat i el pas del temps.",
      },
    ],
  },
  collaborations: {
    titleHtml: "Col<span class='l-geminada'>·</span>laboracions",
    highlight: "Si creus que podem treballar junts, estaré encantada de conèixer la teva proposta.",
    areasTitle: "Àrees",
    areas: [
      "Recerca clínica",
      "Prevenció cardiorenal",
      "Salut digital i IA",
      "Docència i conferències",
      "Divulgació mèdica",
    ],
    entitiesTitle: "Entitats",
    entities: [
      "Hospitals i centres sanitaris",
      "Universitats i centres de recerca",
      "Empreses de salut digital",
      "Societats científiques",
      "Mitjans de comunicació",
    ],
    cta: "Enviar una proposta",
  },
  contact: {
    title: "Contacte",
    email: "info@draestelamas.com",
    labels: { name: "Nom", surname: "Cognoms", email: "Email", message: "Missatge" },
    gdpr: "Les seves dades seran tractades amb total confidencialitat d'acord amb el RGPD. No es cediran a tercers.",
    privacyLink: "Política de Privacitat completa",
    art13: "Informació bàsica sobre protecció de dades: Responsable: Estela de los Ángeles Mas Ródenas. Finalitat: respondre a la seva consulta. Base legal: interès legítim (consulta espontània) o mesures precontractuals (sol·licitud de pressupost). Drets: pot exercir els seus drets d'accés, rectificació, supressió, oposició i portabilitat escrivint a info@draestelamas.com.",
    submit: "Enviar",
    sending: "Enviant...",
    success: "✓ Missatge enviat. La Dra. Mas Ródenas es posarà en contacte amb vostè en breu.",
    error: "Hi ha hagut un error. Contacti per correu electrònic.",
  },
  footer: {
    name: "Dra. Estela Mas Ródenas",
    specialty: "Especialista en Nefrologia · Salut cardiorenometabòlica · Mallorca",
    privacyLabel: "Política de privacitat",
    legalLabel: "Avís legal",
  },
  privacy: {
    title: "Política de Privacitat",
    back: "Tornar a l'inici",
    sections: [
      {
        heading: "1. Responsable del tractament",
        bodyHtml:
          "<strong>Estela de los Ángeles Mas Ródenas</strong><br />Nefròloga col·legiada nº 070711336<br />Mallorca, Illes Balears, Espanya<br />Email: info@draestelamas.com<br />Web: www.draestelamas.com",
      },
      {
        heading: "2. Dades que recollim",
        bodyHtml:
          "A través del formulari de contacte recollim: nom, cognoms i adreça de correu electrònic. De manera opcional, un missatge.",
      },
      {
        heading: "3. Finalitat del tractament",
        bodyHtml:
          "Les dades recollides s'utilitzen exclusivament per respondre a les sol·licituds de consulta o contacte enviades a través del formulari web. No s'utilitzen per a cap altra finalitat.",
      },
      {
        heading: "4. Base legal",
        bodyHtml:
          "El tractament es basa en l'<strong>interès legítim</strong> de respondre a la consulta espontània (art. 6.1.f del RGPD) o, si es tracta d'una sol·licitud de pressupost, en mesures <strong>precontractuals</strong> a petició de la persona interessada (art. 6.1.b del RGPD).",
      },
      {
        heading: "5. Conservació de les dades",
        bodyHtml:
          "Les dades es conserven durant el temps estrictament necessari per atendre la sol·licitud i, en cas de relació assistencial, durant el termini legalment establert per a la documentació clínica.",
      },
      {
        heading: "6. Destinataris",
        bodyHtml:
          "Les dades no es cedeixen a tercers, excepte obligació legal. El formulari de contacte utilitza el servei <strong>Resend</strong> per a la tramesa del missatge, amb garanties adequades de protecció de dades.",
      },
      {
        heading: "7. Drets de la persona interessada",
        bodyHtml:
          "Pot exercir els drets d'accés, rectificació, supressió, oposició, limitació i portabilitat de les seves dades dirigint-se a <strong>info@draestelamas.com</strong>, indicant el seu nom i la sol·licitud concreta. Té dret a presentar una reclamació davant l'<strong>Agència Espanyola de Protecció de Dades</strong> (www.aepd.es).",
      },
      {
        heading: "8. Cookies",
        bodyHtml:
          "Aquesta web no utilitza galetes de seguiment ni analítiques, ni cap mecanisme d'emmagatzematge local. La preferència d'idioma es reflecteix únicament a l'adreça de la pàgina (/, /es/, /en/), sense recollir dades personals.",
      },
    ],
    updated: "Darrera actualització: Juliol de 2026",
  },
  legal: {
    title: "Avís Legal",
    back: "Tornar a l'inici",
    sections: [
      {
        heading: "1. Titular del lloc web",
        bodyHtml:
          "<strong>Estela de los Ángeles Mas Ródenas</strong><br />Nefròloga. Número de col·legiada: <strong>070711336</strong><br />Mallorca, Illes Balears, Espanya<br />Email: info@draestelamas.com<br />Web: www.draestelamas.com",
      },
      {
        heading: "2. Objecte i àmbit d'aplicació",
        bodyHtml:
          "Aquest avís legal regula l'ús del lloc web www.draestelamas.com, titularitat de la Dra. Estela de los Ángeles Mas Ródenas. L'accés i l'ús d'aquest lloc web impliquen l'acceptació d'aquestes condicions.",
      },
      {
        heading: "3. Caràcter informatiu",
        bodyHtml:
          "Els continguts d'aquesta web tenen caràcter exclusivament informatiu i divulgatiu. <strong>No substitueixen en cap cas la consulta mèdica presencial ni el diagnòstic clínic individualitzat.</strong> Per a qualsevol decisió relacionada amb la salut, es recomana consultar un professional sanitari.",
      },
      {
        heading: "4. Propietat intel·lectual",
        bodyHtml:
          "Tots els continguts d'aquesta web (textos, imatges, obres d'art, disseny i codi) són propietat de la Dra. Estela de los Ángeles Mas Ródenas o estan degudament autoritzats. Queda prohibida la seva reproducció, distribució o comunicació pública sense autorització expressa.",
      },
      {
        heading: "5. Responsabilitat",
        bodyHtml:
          "La titular no es fa responsable dels danys que puguin derivar-se de l'ús de la informació continguda en aquest lloc web, ni de les interrupcions del servei per causes tècniques alienes al seu control.",
      },
      {
        heading: "6. Legislació aplicable",
        bodyHtml:
          "Aquest avís legal es regeix per la legislació espanyola vigent, en particular per la Llei 34/2002, d'11 de juliol, de Serveis de la Societat de la Informació i de Comerç Electrònic (LSSI-CE), i pel Reglament (UE) 2016/679 (RGPD).",
      },
    ],
    updated: "Darrera actualització: Juliol de 2026",
  },
};

export default ca;
