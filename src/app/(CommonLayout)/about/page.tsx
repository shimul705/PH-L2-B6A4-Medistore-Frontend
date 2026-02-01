import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>About MediStore</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-gray-700">
            <p>
              MediStore is a demo e-commerce platform for ordering medicines online. Browse verified
              medicines, add to cart, and place orders with delivery details.
            </p>
            <p>
              This frontend integrates with your MediStore backend (Prisma + NeonDB + Better Auth) and
              demonstrates role-based dashboards for customers, sellers, and admins.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
