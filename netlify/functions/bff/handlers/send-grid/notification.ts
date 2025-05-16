import sgMail from "@sendgrid/mail";
import { HandlerEvent } from "@netlify/functions";
import { errorResponse, jsonResponse } from "@/lib/response";
import { Gift } from "@/types/gifts";
import authCheck from "../auth/auth.check";

interface EmailData {
  user: {
    name: string;
    email: string;
  };
  gift: Gift;
}

interface EmailContent {
  subject: string;
  text: string;
  html: string;
}

const SENDER_EMAIL = "bruno-151299@hotmail.com";
const RECIPIENT_EMAIL = "amanda0bruno@gmail.com";
const BR_FORMATTER = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const LOGO_SVG = `<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="500.000000pt" height="500.000000pt" viewBox="0 0 500.000000 500.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,500.000000) scale(0.100000,-0.100000)"
fill="#000000" stroke="none">
<path d="M2220 4809 c-416 -48 -851 -232 -1185 -502 -164 -133 -348 -335 -475
-522 -273 -405 -416 -934 -380 -1414 25 -346 95 -612 234 -896 242 -492 641
-878 1141 -1102 242 -109 494 -168 821 -193 210 -16 499 13 724 74 402 107
733 297 1029 589 418 412 651 929 691 1526 53 811 -344 1606 -1033 2068 -293
197 -672 334 -1029 372 -113 13 -429 12 -538 0z m540 -60 c318 -33 658 -152
942 -330 516 -323 891 -856 1012 -1434 71 -342 64 -723 -19 -1045 -63 -243
-201 -546 -334 -730 -242 -334 -511 -566 -860 -739 -316 -158 -641 -234 -1001
-234 -183 0 -296 12 -475 50 -667 141 -1242 587 -1549 1200 -113 225 -179 437
-222 714 -19 124 -21 430 -5 564 65 518 285 970 650 1336 363 364 866 605
1351 648 69 6 143 13 165 15 54 5 229 -3 345 -15z"/>
<path d="M2382 3902 c-11 -7 -11 -122 -3 -633 21 -1274 32 -1805 37 -1826 3
-18 11 -23 35 -23 19 0 32 6 36 17 8 21 -32 2446 -41 2460 -5 8 -54 11 -64 5z"/>
<path d="M2521 3901 c-12 -8 -13 -75 -8 -438 10 -645 27 -1552 35 -1810 l7
-228 29 -3 c16 -2 32 0 37 5 5 5 5 240 -1 559 -5 302 -15 842 -21 1199 -6 358
-14 666 -18 685 -7 37 -32 49 -60 31z"/>
<path d="M1285 3389 c-4 -13 -41 -98 -82 -189 -101 -222 -92 -203 -176 -395
-101 -229 -249 -566 -358 -811 -49 -110 -89 -206 -89 -212 0 -13 116 -15 159
-3 22 6 76 120 198 416 8 19 19 20 351 23 l343 2 15 -37 c8 -21 49 -120 91
-220 l77 -182 50 -6 c66 -8 132 -1 128 14 -2 13 -418 987 -555 1301 -44 102
-90 208 -101 235 -12 28 -26 59 -33 69 -10 18 -11 18 -18 -5z m60 -489 c20
-52 77 -189 126 -303 49 -114 89 -210 89 -212 0 -3 -122 -5 -271 -5 -213 0
-270 3 -266 13 30 72 259 603 264 610 9 14 19 -3 58 -103z"/>
<path d="M3419 3099 c-3 -1280 -2 -1311 12 -1321 9 -6 109 -7 259 -4 312 6
375 20 501 112 164 119 198 381 75 567 -42 64 -84 98 -162 134 l-56 25 45 47
c58 59 84 113 97 198 28 177 -52 352 -192 424 -98 51 -152 60 -370 66 l-208 6
-1 -254z m459 66 c95 -29 139 -89 149 -203 12 -147 -36 -241 -144 -282 -41
-15 -91 -23 -175 -27 l-118 -6 0 273 0 273 119 -7 c65 -3 141 -13 169 -21z
m47 -675 c161 -31 245 -122 246 -264 1 -112 -35 -183 -118 -236 -66 -42 -163
-60 -327 -60 l-141 0 2 287 c2 159 3 290 3 292 0 8 276 -8 335 -19z"/>
</g>
</svg>`;

const getLastOrderId = (gift: Gift): string => {
  if (!gift.GiftOnOrder || gift.GiftOnOrder.length === 0) {
    return "N/A";
  }
  const lastOrder = gift.GiftOnOrder[gift.GiftOnOrder.length - 1];
  return lastOrder?.order.id.toString();
};

const buildEmailContent = (
  gift: Gift,
  user: EmailData["user"]
): EmailContent => {
  const orderId = getLastOrderId(gift);
  return {
    subject: `AB Casa Nova - Compra Efetuada! #${orderId}`,
    text: `O presente ${gift.name} foi comprado por ${user.name} (${user.email}).`,
    html: `
      <!DOCTYPE html>
      <html lang="pt-BR">
        ${buildEmailHead()}
        ${buildEmailBody(gift, user, orderId)}
      </html>
    `,
  };
};

const buildEmailHead = (): string => `
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nova Compra Efetuada</title>
  </head>
`;

const buildEmailBody = (
  gift: Gift,
  user: EmailData["user"],
  orderId: string
): string => `
  <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; color: #1e293b;">
      ${buildHeader()}
      ${buildMainContent(gift, user, orderId)}
      ${buildFooter(gift)}
    </div>
    ${buildDarkModeStyles()}
  </body>
`;

const buildHeader = (): string => `
  <header style="padding: 1.5rem; border-bottom: 1px solid #e2e8f0; text-align: center;">
    ${LOGO_SVG}
  </header>
`;

const buildMainContent = (
  gift: Gift,
  user: EmailData["user"],
  orderId: string
): string => `
  <main style="padding: 2rem;">
    ${buildConfirmationBadge()}
    ${buildGiftDetails(gift, user)}
    ${buildOrderDetails(user, orderId)}
    ${buildViewGiftLink(gift.id)}
  </main>
`;

const buildConfirmationBadge = (): string => `
  <div style="text-align: center; margin-top: 2rem; margin-bottom: 2rem;">
    <div style="display: inline-flex; align-items: center; background-color: #0596691a; color: #059669; padding: 0.5rem 1rem; border-radius: 9999px; font-size: 0.875rem;">
      <svg style="width: 1rem; height: 1rem; margin-right: 0.5rem;" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
      </svg>
      COMPRA CONFIRMADA
    </div>
  </div>
`;

const buildGiftDetails = (gift: Gift, user: EmailData["user"]): string => `
  <div style="margin-bottom: 2rem;">
    <h1 style="font-size: 1.5rem; font-weight: 700; color: #1e293b; margin-bottom: 1rem;">Novo Presente Comprado!</h1>
    <p style="color: #64748b; margin-bottom: 1.5rem;">Você recebeu uma nova compra em sua lista de presentes.</p>
    
    <div style="border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 1.5rem;">
      <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 1rem; margin-bottom: 1.5rem;">
        <div style="background-color: #f1f5f9; border-radius: 0.75rem; padding: 1rem; text-align: center;">
          <img src="${gift.imageUrl}" alt="${
  gift.name
}" style="max-width: 150px; height: auto; margin: 0 auto;"/>
        </div>
        <div>
          <h2 style="font-size: 1.25rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">${
            gift.name
          }</h2>
          <div style="color: #4f46e5; font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem;">
            ${BR_FORMATTER.format(gift.price)}
          </div>
          <div style="display: inline-block; background-color: #e0e7ff; color: #4f46e5; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem;">
            ${gift.Category.name}
          </div>
        </div>
      </div>
    </div>
  </div>
`;

const buildOrderDetails = (
  user: EmailData["user"],
  orderId: string
): string => `
  <div style="border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
      <div>
        <div style="font-size: 0.875rem; color: #64748b;">Comprador</div>
        <div style="font-weight: 600; color: #1e293b;">${user.name}</div>
        <div style="font-size: 0.875rem; color: #64748b;">${user.email}</div>
      </div>
      <div>
        <div style="font-size: 0.875rem; color: #64748b;">Data da Compra</div>
        <div style="font-weight: 600; color: #1e293b;">${new Date().toLocaleDateString(
          "pt-BR"
        )}</div>
      </div>
      <div>
        <div style="font-size: 0.875rem; color: #64748b;">Número do Pedido</div>
        <div style="font-weight: 600; color: #1e293b;">${orderId}</div>
      </div>
    </div>
  </div>
`;

const buildViewGiftLink = (giftId: number): string => `
  <a href="https://abcasanova.com.br/gifts/${giftId}" 
    style="display: block; text-align: center; 
    background-color: #4f46e5; color: #ffffff; 
    padding: 1rem 2rem; border-radius: 9999px; 
    text-decoration: none; font-weight: 600; 
    transition: background-color 0.2s;">
    Ver Presente
  </a>
`;

const buildFooter = (gift: Gift): string => `
  <footer style="padding: 2rem; background-color: #f8fafc; color: #64748b; text-align: center;">
    <div style="margin-bottom: 1rem;">
      <a href="https://abcasanova.com.br/admin-orders" 
        target="_blank" 
        style="color: #4f46e5; text-decoration: none; margin: 0 0.5rem;">
        Acessar Pedidos
      </a>
      <span style="color: #cbd5e1;">•</span>
      <a href="${gift.purchaseLink}" 
        target="_blank" 
        style="color: #4f46e5; text-decoration: none; margin: 0 0.5rem;">
        Link de Compra
      </a>
    </div>
    <div style="font-size: 0.875rem;">
      © ${new Date().getFullYear()} AB Casa Nova. Todos os direitos reservados.
    </div>
  </footer>
`;

const buildDarkModeStyles = (): string => `
  <style>
    @media (prefers-color-scheme: dark) {
      body { background-color: #0f172a; }
      div { 
        background-color: #1e293b !important;
        color: #f8fafc !important;
        border-color: #334155 !important;
      }
      h1, h2, .dark\\:text-gray-200 { color: #f8fafc !important; }
      .dark\\:bg-slate-800 { background-color: #1e293b !important; }
      .dark\\:text-gray-400 { color: #94a3b8 !important; }
    }
  </style>
`;

export async function sendEmail(event: HandlerEvent) {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error("SendGrid API key not configured");
    }
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const session = await authCheck(event);
    if (!session) return errorResponse(401, "Unauthorized");

    if (!event.body) return errorResponse(400, "No data provided");

    const { gift, user }: EmailData = JSON.parse(event.body);
    if (!gift || !user) return errorResponse(400, "Invalid request data");

    const emailContent = buildEmailContent(gift, user);

    await sgMail.send({
      to: RECIPIENT_EMAIL,
      from: SENDER_EMAIL,
      ...emailContent,
    });

    return jsonResponse(200, {
      emailSent: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Email send error:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return errorResponse(500, `Failed to send email: ${message}`);
  }
}
