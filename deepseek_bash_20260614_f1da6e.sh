mkdir -p prisma
cat > prisma/schema.prisma << 'EOF'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model User {
  id           String    @id @default(cuid())
  email        String    @unique
  password     String
  name         String
  phone        String?
  role         String    @default("USER")
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  
  chats        Chat[]
  events       AnalyticsEvent[]
}

model Chat {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  message   String
  response  String?
  role      String
  context   String?
  createdAt DateTime @default(now())
}

model AnalyticsEvent {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  eventType String
  metadata  String?
  createdAt DateTime @default(now())
}

model Document {
  id        String   @id @default(cuid())
  filename  String
  content   String
  embedding String?
  createdAt DateTime @default(now())
}
EOF