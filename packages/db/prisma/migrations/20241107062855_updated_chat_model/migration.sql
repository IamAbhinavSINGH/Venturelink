-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'human';

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "role" TEXT;
