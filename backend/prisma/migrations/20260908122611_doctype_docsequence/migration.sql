-- DropIndex
DROP INDEX "finance"."document_sequences_seller_gst_profile_id_financial_year_key";

-- RenameIndex
ALTER INDEX "finance"."document_sequences_seller_gst_profile_id_doc_type_financial_yea" RENAME TO "document_sequences_seller_gst_profile_id_doc_type_financial_key";
