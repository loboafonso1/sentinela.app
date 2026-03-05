module.exports = async function (req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  try {
    const payload = req.body;

    console.log("Webhook Kiwify recebido:");
    console.log(payload);

    return res.status(200).json({
      success: true,
      message: "Webhook recebido com sucesso",
    });
  } catch (error) {
    console.error("Erro webhook:", error);

    return res.status(500).json({
      success: false,
      message: "Erro interno",
    });
  }
};
