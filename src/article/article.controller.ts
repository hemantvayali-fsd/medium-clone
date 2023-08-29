import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './article.dto';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { User } from '@app/user/decorators/user.decorator';
import { UserEntity } from '@app/user/user.entity';
import { ArticleEntity } from './article.entity';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createArticle(
    @User() currentUser: UserEntity,
    @Body('article') payload: CreateArticleDto,
  ) {
    return this.articleService.createArticle(currentUser, payload);
  }

  @Get(':slug')
  async getArticleBySlug(@Param('slug') slug: string): Promise<ArticleEntity> {
    const article = await this.articleService.getArticleBySlug(slug);
    return article;
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deleteArticle(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ) {
    return this.articleService.deleteBySlug(currentUserId, slug);
  }
}
