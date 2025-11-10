import "../server/loadEnv";
import { db, pool } from "../server/db";
import { universities, subscriptionPlans, routes, buses, schedules } from "@shared/schema";

async function seed() {
  try {
    console.log("🌱 Seeding database...");

    // Universities in Angola
    const uniValues = [
      {
        name: "Universidade Agostinho Neto",
        code: "UAN",
        address: "Luanda, Angola",
      },
      {
        name: "Universidade Católica de Angola",
        code: "UCAN",
        address: "Luanda, Angola",
      },
      {
        name: "Universidade Metodista de Angola",
        code: "UMA",
        address: "Luanda, Angola",
      },
      {
        name: "Instituto Superior Politécnico de Tecnologias e Ciências",
        code: "ISPTEC",
        address: "Talatona, Luanda",
      },
      {
        name: "Universidade Jean Piaget de Angola",
        code: "UJPA",
        address: "Luanda, Angola",
      },
    ];

    // Subscription plans with realistic pricing for Angola
    const planValues = [
      {
        name: "Semanal",
        duration: "weekly",
        price: "2500.00",
        features: ["10 viagens por semana", "Desconto de 15%", "Reserva prioritária"],
        isActive: true,
      },
      {
        name: "Mensal",
        duration: "monthly",
        price: "8000.00",
        features: ["Viagens ilimitadas", "Desconto de 25%", "Reserva prioritária", "Suporte premium"],
        isActive: true,
      },
      {
        name: "Mensal Plus",
        duration: "monthly",
        price: "12000.00",
        features: ["Viagens ilimitadas", "Desconto de 30%", "Reserva VIP", "Suporte 24/7", "Wi-Fi grátis"],
        isActive: true,
      },
    ];

    console.log("Creating universities...");
    const insertedUnis = await db
      .insert(universities)
      .values(uniValues)
      .onConflictDoNothing()
      .returning();
    
    if (insertedUnis.length > 0) {
      console.log(`✅ Created ${insertedUnis.length} universities:`, insertedUnis.map((u: any) => u.name));
    } else {
      console.log("Universities already present — skipped inserts");
    }

    console.log("Creating subscription plans...");
    const insertedPlans = await db
      .insert(subscriptionPlans)
      .values(planValues)
      .onConflictDoNothing()
      .returning();
    
    if (insertedPlans.length > 0) {
      console.log(`✅ Created ${insertedPlans.length} subscription plans:`, insertedPlans.map((p: any) => p.name));
    } else {
      console.log("Subscription plans already present — skipped inserts");
    }

    // Routes for Luanda
    console.log("Creating routes...");
    const routeValues = [
      {
        name: "Rota Campus Central - Maianga",
        description: "Rota principal do campus central para zona residencial da Maianga",
        origin: "UAN Campus Central",
        destination: "Maianga",
        estimatedDuration: 45,
        stops: [
          { name: "UAN Campus Central", order: 1, estimatedTime: "07:00" },
          { name: "Kinaxixi", order: 2, estimatedTime: "07:15" },
          { name: "Praça 1º de Maio", order: 3, estimatedTime: "07:30" },
          { name: "Maianga", order: 4, estimatedTime: "07:45" }
        ],
        isActive: true,
      },
      {
        name: "Rota Talatona - ISPTEC",
        description: "Conecta zona de Talatona ao ISPTEC",
        origin: "Talatona Shopping",
        destination: "ISPTEC",
        estimatedDuration: 20,
        stops: [
          { name: "Talatona Shopping", order: 1, estimatedTime: "06:30" },
          { name: "Benfica", order: 2, estimatedTime: "06:40" },
          { name: "ISPTEC", order: 3, estimatedTime: "06:50" }
        ],
        isActive: true,
      },
      {
        name: "Rota Centro - UCAN",
        description: "Do centro da cidade para UCAN",
        origin: "Centro da Cidade",
        destination: "UCAN Kilamba",
        estimatedDuration: 35,
        stops: [
          { name: "Centro da Cidade", order: 1, estimatedTime: "07:00" },
          { name: "Coqueiros", order: 2, estimatedTime: "07:20" },
          { name: "UCAN Kilamba", order: 3, estimatedTime: "07:35" }
        ],
        isActive: true,
      },
    ];

    const insertedRoutes = await db
      .insert(routes)
      .values(routeValues)
      .onConflictDoNothing()
      .returning();
    
    if (insertedRoutes.length > 0) {
      console.log(`✅ Created ${insertedRoutes.length} routes:`, insertedRoutes.map((r: any) => r.name));

      // Create buses for the routes
      console.log("Creating buses...");
      const busValues = [
        {
          number: "TF-001",
          routeId: insertedRoutes[0].id,
          capacity: 50,
          isActive: true,
          currentLocation: { lat: -8.8383, lng: 13.2344 },
        },
        {
          number: "TF-002",
          routeId: insertedRoutes[0].id,
          capacity: 50,
          isActive: true,
          currentLocation: { lat: -8.8383, lng: 13.2344 },
        },
        {
          number: "TF-003",
          routeId: insertedRoutes[1].id,
          capacity: 45,
          isActive: true,
          currentLocation: { lat: -8.9167, lng: 13.1944 },
        },
        {
          number: "TF-004",
          routeId: insertedRoutes[2].id,
          capacity: 40,
          isActive: true,
          currentLocation: { lat: -8.8155, lng: 13.2302 },
        },
      ];

      const insertedBuses = await db
        .insert(buses)
        .values(busValues)
        .onConflictDoNothing()
        .returning();

      if (insertedBuses.length > 0) {
        console.log(`✅ Created ${insertedBuses.length} buses`);

        // Create schedules
        console.log("Creating schedules...");
        const scheduleValues = [
          // Route 1 - Morning, lunch, evening schedules
          {
            busId: insertedBuses[0].id,
            routeId: insertedRoutes[0].id,
            departureTime: "07:00",
            arrivalTime: "07:45",
            daysOfWeek: "Mon,Tue,Wed,Thu,Fri",
            isActive: true,
          },
          {
            busId: insertedBuses[0].id,
            routeId: insertedRoutes[0].id,
            departureTime: "12:00",
            arrivalTime: "12:45",
            daysOfWeek: "Mon,Tue,Wed,Thu,Fri",
            isActive: true,
          },
          {
            busId: insertedBuses[0].id,
            routeId: insertedRoutes[0].id,
            departureTime: "17:00",
            arrivalTime: "17:45",
            daysOfWeek: "Mon,Tue,Wed,Thu,Fri",
            isActive: true,
          },
          // Route 1 - Second bus
          {
            busId: insertedBuses[1].id,
            routeId: insertedRoutes[0].id,
            departureTime: "08:00",
            arrivalTime: "08:45",
            daysOfWeek: "Mon,Tue,Wed,Thu,Fri",
            isActive: true,
          },
          // Route 2
          {
            busId: insertedBuses[2].id,
            routeId: insertedRoutes[1].id,
            departureTime: "06:30",
            arrivalTime: "06:50",
            daysOfWeek: "Mon,Tue,Wed,Thu,Fri",
            isActive: true,
          },
          {
            busId: insertedBuses[2].id,
            routeId: insertedRoutes[1].id,
            departureTime: "16:30",
            arrivalTime: "16:50",
            daysOfWeek: "Mon,Tue,Wed,Thu,Fri",
            isActive: true,
          },
          // Route 3
          {
            busId: insertedBuses[3].id,
            routeId: insertedRoutes[2].id,
            departureTime: "07:00",
            arrivalTime: "07:35",
            daysOfWeek: "Mon,Tue,Wed,Thu,Fri",
            isActive: true,
          },
        ];

        const insertedSchedules = await db
          .insert(schedules)
          .values(scheduleValues)
          .onConflictDoNothing()
          .returning();

        if (insertedSchedules.length > 0) {
          console.log(`✅ Created ${insertedSchedules.length} schedules`);
        }
      }
    } else {
      console.log("Routes already present — skipped route-related inserts");
    }

    console.log("\n✅ Seeding finished successfully!");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exitCode = 1;
  } finally {
    // Do not call pool.end() here: if the server is running in another
    // process it shares the same DB and closing the pool may interfere.
  }
}

seed();
