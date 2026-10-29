import {sqliteTable,text} from 'drizzle-orm/sqlite-core';
export const workspaces=sqliteTable('workspaces',{userId:text('user_id').primaryKey(),body:text('body').notNull(),updatedAt:text('updated_at').notNull()});
export const documents=sqliteTable('documents',{id:text('id').primaryKey(),userId:text('user_id').notNull(),body:text('body').notNull(),createdAt:text('created_at').notNull()});
export const standards=sqliteTable('standards',{id:text('id').primaryKey(),userId:text('user_id').notNull(),documentId:text('document_id').notNull(),body:text('body').notNull(),status:text('status').notNull(),updatedAt:text('updated_at').notNull()});
