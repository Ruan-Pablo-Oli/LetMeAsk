import {reset, seed} from 'drizzle-seed'
import { db } from './connection.ts'
import { schema } from './schema/index.ts'

await seed(db,{schema, })