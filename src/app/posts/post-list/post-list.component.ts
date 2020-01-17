import { Component, OnInit, OnDestroy } from '@angular/core';
import {Post} from '../post.model';
import { PostsService } from '../post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html'
})

export class PostListComponent implements OnInit, OnDestroy {
  // Adding @Input decorator, we can bind the property from the parent component.
  // @Input() posts: Post[] = [];

  posts: Post[] = [];
  isLoading = false;
  private postsSub: Subscription;

  constructor(public postService: PostsService) {}

ngOnInit() {
  this.isLoading = true;
  this.postService.getPosts();

  // setup a listener to that subject
  this.postsSub = this.postService.getPostUpdateListener()
    // the 1st arg is a function called whenever a new value is received.
    .subscribe((posts: Post[]) => {
      this.isLoading = false;
      // update the posts with a new value received
      this.posts = posts;
    });
}
// Called whenever the component is about to get removed.
ngOnDestroy() {
  // THis will remove the subscription and prevent memory leaks.
  this.postsSub.unsubscribe();
}

onDelete(postid: string) {
  this.postService.deletePost(postid);
}
}
