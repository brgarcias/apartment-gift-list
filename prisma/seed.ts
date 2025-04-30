import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.createMany({
    data: [
      {
        name: "Bruno Garcia",
        birthDate: "15/12/1999",
      },
      {
        name: "Amanda Roque",
        birthDate: "11/07/2000",
      },
    ],
    skipDuplicates: true,
  });

  const gifts = await prisma.gift.createMany({
    data: [
      {
        name: "Geladeira",
        price: 6000,
        description:
          "Geladeira Brastemp Inverse 3 Frost Free 419 litros cor Inox com Freeze Control Pro-BRY59CK",
        purchaseLink:
          "https://www.brastemp.com.br/geladeira-brastemp-inverse-3-frost-free-419-litros-cor-inox-com-freeze-control-pro-bry59ck/p",
        imageUrl:
          "https://drive.google.com/uc?export=view&id=1xXvTN09KFu74ynhJiSq_0G0nQ_Xyd6fC",
      },
      {
        name: "Cooktop",
        price: 2000,
        description:
          "Cooktop 4 bocas de indução Brastemp com Funções Especiais - BDJ60BE",
        purchaseLink:
          "https://www.brastemp.com.br/cooktop-4-bocas-de-inducao-brastemp-com-funcoes-especiais-bdj60be/p",
        imageUrl:
          "https://drive.google.com/uc?export=view&id=1mjJeXTjWxKcDkbSFG3AAjPCcbtXHFQO7",
      },
      {
        name: "Forno",
        price: 2000,
        description:
          "Forno de Embutir a Gás Brastemp 78 Litros Preto com Grill e Timer Touch - BOA84AE",
        purchaseLink:
          "https://www.brastemp.com.br/forno-a-gas-de-embutir-brastemp-boa84ae/p",
        imageUrl:
          "https://drive.google.com/uc?export=view&id=1xmyzGXH0Tfzcla1WSwVBnTnOiexjT7vG",
      },
      {
        name: "Depurador",
        price: 1000,
        description:
          "Depurador de Ar Electrolux 60cm Retrátil Preto Efficient com Luz de Led (DE6RP)",
        purchaseLink:
          "https://loja.electrolux.com.br/depurador-de-ar-electrolux-60cm-retratil-efficient-de6rp/p",
        imageUrl:
          "https://drive.google.com/uc?export=view&id=1Ef3DGfv-r3UW4Fwk9OBU5rvaP4V4QsYx",
      },
      {
        name: "Microondas",
        price: 1000,
        description:
          "Micro-ondas Brastemp 32 Litros cor Inox Espelhado com Grill e Painel Integrado - BMG45AR",
        purchaseLink:
          "https://www.brastemp.com.br/micro-ondas-brastemp-espelhado-grill-32-litros-bmg45ar/p",
        imageUrl:
          "https://drive.google.com/uc?export=view&id=1D3yOxCi9xzISG-nlJFAFGqeR392JRu3v",
      },
    ],
    skipDuplicates: true,
  });

  console.log({ users, gifts });
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
