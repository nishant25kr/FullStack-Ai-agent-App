import { Inngest, NonRetriableError } from "inngest";
import User from "../../model/user.model";
import { sendMail } from "../../utils/mailer";

export const onUserSignup = Inngest.createFunction(
  { id: "on-user-signup", retries: 2 },
  { event: "user/signup" },
  async ({ event, step }) => {
    try {
      const { email } = event.data;

      const userObj = await step.run("get-user-email", async () => {
        const user = await User.findOne({ email });
        if (!user) {
          throw new NonRetriableError("User no longer exists in our database");
        }
        return user;
      });

      await step.run("send-welcome-email", async () => {
        const subject = "Welcome to the app";
        const message = `Hi ${userObj.name || ""},
        
Thanks for signing up, we are glad to have you onboard!`;

        await sendMail(email, subject, message);
      });

      return { success: true };
    } catch (error) {
      console.error(error.message);
      return { success: false, error: error.message };
    }
  }
);
