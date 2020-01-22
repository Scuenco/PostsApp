import {Post} from './post.model';
import { Injectable } from '@angular/core';
import { Subject} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { stringify } from 'querystring';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

// @Injectable will create one instance of the service for the entire app
@Injectable({providedIn: 'root'})
export class PostsService {

  // "private": can't edit it from outside
  private posts: Post [] = [];
  private postsUpdated = new Subject<Post[]>(); // similar to: new EventEmitter();

  constructor(private httpClient: HttpClient, private router: Router) {}

  getPosts() {
    this.httpClient.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
      .pipe(map(postData => {
        return postData.posts.map( mappedData => {
            return {
              title: mappedData.title,
              content: mappedData.content,
              id: mappedData._id
            };
        });
      } ))
      .subscribe((postsData) => {
        this.posts = postsData;
        this.postsUpdated.next([...this.posts]);
      });
  }
  // Returns an object which we can now listen to but not emit
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    // find that post with the given id, put it in a new Javascript object and return it.
    // return {...this.posts.find( p => p.id === id)};

    // we will no longer get post info from the front end but instead get it from the server.
    return this.httpClient.get<{_id: string, title: string, content: string}>('http://localhost:3000/api/posts/' + id);
  }

  addPost(title: string, content: string) {
    // This is a shorthand for: {id: null, title: title, content: content };
    const post: Post = {id: null, title, content};
    this.httpClient.post<{ message: string, postId: string }>('http://localhost:3000/api/posts', post)
    // Handle the success case.
    .subscribe(responseData => {
      // we are getting back the auto generated _id before adding to posts
        post.id = responseData.postId;
        this.posts.push(post);

        // We are emitting a copy of posts after updating them by using 'next' which emits a new value.
        // Similar to this.postsUpdated.emit()
        this.postsUpdated.next([...this.posts]);

        // Navigate back to main page
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = {id, title, content};
    this.httpClient.put('http://localhost:3000/api/posts/' + id, post )
    .subscribe((responseData) => {
      // if successful, update the front end array with updated post
      // clone the updated post
      const updatedPosts = [...this.posts];

      // find that post in the front end array
      const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;

      // tell my app about the update
      this.postsUpdated.next([...this.posts]);

      // Navigate back to main page
      this.router.navigate(['/']);
    });
  }

  deletePost(postId: string) {
    this.httpClient.delete('http://localhost:3000/api/posts/' + postId)
    .subscribe(() => {
      const updatedPosts = this.posts.filter( post => post.id !== postId );
      this.posts = updatedPosts;
      // inform our app and the other parts of our app about this update
      this.postsUpdated.next([...this.posts]);
    });
  }
}
