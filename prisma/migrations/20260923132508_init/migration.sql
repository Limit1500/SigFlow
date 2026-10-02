-- CreateTable
CREATE TABLE "Users" (
    "id" INTEGER NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Events" (
    "id" SERIAL NOT NULL,
    "keyWord" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Microservices" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "secret" TEXT NOT NULL,

    CONSTRAINT "Microservices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EventsToMicroservices" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_EventsToMicroservices_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Events_userId_keyWord_key" ON "Events"("userId", "keyWord");

-- CreateIndex
CREATE UNIQUE INDEX "Microservices_secret_name_key" ON "Microservices"("secret", "name");

-- CreateIndex
CREATE INDEX "_EventsToMicroservices_B_index" ON "_EventsToMicroservices"("B");

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventsToMicroservices" ADD CONSTRAINT "_EventsToMicroservices_A_fkey" FOREIGN KEY ("A") REFERENCES "Events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventsToMicroservices" ADD CONSTRAINT "_EventsToMicroservices_B_fkey" FOREIGN KEY ("B") REFERENCES "Microservices"("id") ON DELETE CASCADE ON UPDATE CASCADE;
