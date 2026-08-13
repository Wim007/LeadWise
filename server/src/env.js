/**
 * Laadt de omgevingsvariabelen.
 *
 * De server draait vanuit /server, maar de .env staat in de projectroot zodat
 * er één plek is voor alle instellingen. Een .env in /server heeft voorrang,
 * handig als je die ooit apart wilt zetten.
 *
 * Op Railway staan de variabelen al in de omgeving; dotenv overschrijft die niet.
 */
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import dotenv from 'dotenv';

const here = dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: join(here, '..', '.env') });
dotenv.config({ path: join(here, '..', '..', '.env') });
