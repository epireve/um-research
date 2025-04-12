-- CreateTable
CREATE TABLE "supervisors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profile_data" JSONB NOT NULL,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "supervisors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research_interests" (
    "id" SERIAL NOT NULL,
    "supervisor_id" TEXT NOT NULL,
    "interest" TEXT NOT NULL,
    "embedding" vector(768) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "research_interests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supervisor_embeddings" (
    "id" SERIAL NOT NULL,
    "supervisor_id" TEXT NOT NULL,
    "embedding_type" TEXT NOT NULL,
    "embedding" vector(768) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "supervisor_embeddings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "embedding_cache" (
    "text_hash" TEXT NOT NULL,
    "text" VARCHAR(1000) NOT NULL,
    "embedding" vector(768) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_used" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "embedding_cache_pkey" PRIMARY KEY ("text_hash")
);

-- CreateIndex
CREATE UNIQUE INDEX "supervisor_embeddings_supervisor_id_embedding_type_key" ON "supervisor_embeddings"("supervisor_id", "embedding_type");

-- AddForeignKey
ALTER TABLE "research_interests" ADD CONSTRAINT "research_interests_supervisor_id_fkey" FOREIGN KEY ("supervisor_id") REFERENCES "supervisors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supervisor_embeddings" ADD CONSTRAINT "supervisor_embeddings_supervisor_id_fkey" FOREIGN KEY ("supervisor_id") REFERENCES "supervisors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
