import { inngest } from "../client.js";
import User from "../../model/user.model.js";
import { NonRetriableError } from "inngest";
import { sendMail } from "../../utils/mailer.js";

export const onUserSignup = inngest.createFunction(
  { id: "on-user-signup", retries: 2 },
  { event: "user/signup" },
  async ({ event, step }) => {
    console.log("👋 Inngest function triggered for signup");

    try {
      const { email } = event.data;

      // Step 1: Get the user from DB
      const userObject = await step.run("get-user-email", async () => {
        const foundUser = await User.findOne({ email });
        if (!foundUser) {
          throw new NonRetriableError("User no longer exists in our database");
        }
        return foundUser;
      });

      // Step 2: Send welcome email
      await step.run("send-welcome-email", async () => {
        const subject = `Welcome to the app`;
        const message = `Hi ${userObject.email},
        
Thanks for signing up. We're glad to have you onboard!`;

        await sendMail(userObject.email, subject, message);
      });

      return { success: true };
    } catch (error) {
      console.error("❌ Error running signup workflow:", error.message);
      return { success: false, error: error.message };
    }
  }
);
