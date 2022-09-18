import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentRepository } from './comments.repository';
import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentEntity } from './entities/comments.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity]), ConfigModule.forRoot()],
  controllers: [CommentsController],
  providers: [CommentsService, CommentRepository],
})
export class CommentsModule {}
