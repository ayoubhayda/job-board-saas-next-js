import { stripe } from "@/lib/stripe";
import { prisma } from "@/utils/prisma";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(req: Request){
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("Stripe-Signature");

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature!,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch {
        return new Response("Webhook Error", { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
        const customerId = session.customer as string;
        const jobId = session.metadata?.jobId as string;

        if (!jobId) {
            return new Response("Job ID not found", { status: 400 });
        }

        if(!customerId) {
            return new Response("Customer ID not found", { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where:{
                stripeCustomerId: customerId
            },
            select:{
                company:{
                    select:{
                        id:true,
                    }
                }
            }
        })

        if(!user?.company?.id){
            return new Response("Company not found", { status: 400 });
        }

        await prisma.job.update({
            where:{
                id: jobId,
                companyId: user?.company?.id as string
            },
            data:{
                status: "ACTIVE"
            }
        })
        
    }

    return new Response("Webhook received", { status: 200 });
}