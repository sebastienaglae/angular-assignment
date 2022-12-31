class OpenAIService {
    constructor() {
    this.openai = new OpenAI(process.env.OPENAI_API_KEY);
  }
}