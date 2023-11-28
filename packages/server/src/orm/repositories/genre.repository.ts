import { AppDataSource } from 'src/orm/DataSource';
import { Genre } from 'src/orm/entities/Genre';
import { In } from 'typeorm';

const genreRepository = AppDataSource.getRepository(Genre);

export async function upsertGenres(genres: Genre[]) {
  await genreRepository
    .createQueryBuilder()
    .insert()
    .values(genres)
    .orIgnore()
    .execute()
  return genreRepository.find({ where: { name: In(genres.map(g=>g.name))}})
}
