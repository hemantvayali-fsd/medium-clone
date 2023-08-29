import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './article.dto';
import { ArticleEntity } from './article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { UserEntity } from '@app/user/user.entity';
import slugify from 'slugify';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepo: Repository<ArticleEntity>,
  ) {}

  async createArticle(
    user: UserEntity,
    payload: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const article = Object.assign(new ArticleEntity(), payload);
    article.author = user;
    article.slug = this.generateSlug(article.title);

    if (!article.tagList) article.tagList = [];

    return this.articleRepo.save(article);
  }

  async getArticleBySlug(slug: string) {
    if (!slug)
      throw new HttpException('Slug missing', HttpStatus.UNPROCESSABLE_ENTITY);

    return this.articleRepo.findOne({ where: { slug } });
  }

  async deleteBySlug(userId: number, slug: string): Promise<DeleteResult> {
    if (!slug)
      throw new HttpException('Slug missing', HttpStatus.UNPROCESSABLE_ENTITY);

    const article = await this.articleRepo.findOne({ where: { slug } });
    console.log(article);

    if (!article)
      throw new HttpException(`Article not found`, HttpStatus.NOT_FOUND);

    if (article.author.id !== userId)
      throw new HttpException('Action Forbidden!', HttpStatus.FORBIDDEN);

    return this.articleRepo.delete(article.id);
  }

  private generateSlug(title: string) {
    return (
      slugify(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }
}
