import aj from "../config/arcjet.js";

const arcjetMiddleware = async (req, res, next) => {
  try {
    const decision = await aj.protect(req, { requested: 1 });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({
          statusMessage: "Rate Limit exceeded",
        });
      } else if (decision.reason.isBot()) {
        return res.status(403).json({
          statusMessage: "Bot detected",
        });
      } else {
        return res.status(403).json({
          statusMessage: "Forbidden",
        });
      }
    }

    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default arcjetMiddleware;
