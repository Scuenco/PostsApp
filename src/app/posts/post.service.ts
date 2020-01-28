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
              id: mappedData._id,
              imagePath: mappedData.imagePath
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
    return this.httpClient.get<{_id: string, title: string, content: string,
      imagePath: string}> ('http://localhost:3000/api/posts/' + id);
  }

  addPost(title: string, content: string, image: File ) {
    // const post: Post = {id: null, title, content};
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    // this.httpClient.post<{ message: string, postId: string }>
    this.httpClient.post<{ message: string, post: Post }>
      ('http://localhost:3000/api/posts', postData)
    .subscribe(responseData => {
      const post: Post = {
        id: responseData.post.id,
        title: title,
        content: content,
        imagePath: responseData.post.imagePath
      };
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(['/']);
    });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    // const post: Post = {id, title, content, imagePath: null};
    let postData: Post | FormData;
    if (typeof(image) === 'object') {
      // create a form data object
      postData = new FormData();
      postData.append('id', id),
      postData.append('title', title),
      postData.append('content', content),
      postData.append('image', image, title)
    } else {
      // send normal JSON data
      postData = { id, title, content, imagePath: image };
    }
    this.httpClient.put('http://localhost:3000/api/posts/' + id, postData )
    .subscribe((responseData) => {
      // if successful, update the front end array with updated post
      // clone the updated post
      const updatedPosts = [...this.posts];

      // find that post in the front end array
      const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
      const post: Post = {
        id, title, content,
        imagePath: 'responseData.imagePath'
      }; // we get back the image path from the server
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
