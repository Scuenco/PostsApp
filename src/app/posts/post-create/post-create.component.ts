import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { PostsService } from '../post.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private postId: string;

  constructor(public postsService: PostsService, public route: ActivatedRoute ) {}
/*
  // @Output decorator turns it into an event that can be available outside
  @Output() postCreated = new EventEmitter<Post>();

  onAddPost() {
    // Store the entered content in a new JS object (post)
    const post: Post = {
      title: this.enteredTitle,
      content : this.enteredContent
    };
    this.postCreated.emit(post);
  }
*/
ngOnInit() {
  this.form = new FormGroup({
    title: new FormControl(null, {
      validators: [Validators.required, Validators.minLength(3)]
    }),
    content: new FormControl(null, {validators: [Validators.required]
    }),
    image: new FormControl(null, {validators: [Validators.required]})
  });

  this.route.paramMap.subscribe((paramMap: ParamMap) => {
    // if on edit mode
    if (paramMap.has('postId')) {
      this.mode = 'edit';
      this.postId = paramMap.get('postId');
      this.isLoading = true;

      // retrieve that record for editing
      this.postsService.getPost(this.postId).subscribe( postData => {
        this.isLoading = false;
        this.post = { id: postData._id, title: postData.title, content: postData.content };

        // Set the value of the form Group
        this.form.setValue({
          title: this.post.title,
          content: this.post.content
        });
      });
    } else {
       // create mode
      this.mode = 'create';
      this.postId = null;
    }
  });
}

  onImagePicked(event: Event) {
    // extract the selected image file
    const file = (event.target as HTMLInputElement).files[0];

    // Store selected file on our image form control
    this.form.patchValue({image: file});

    // Recalculate the value and validation status of the control.
    this.form.get('image').updateValueAndValidity();

    // Preview image
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      console.log(this.imagePreview);
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(this.form.value.title, this.form.value.content);
    } else {
      this.postsService.updatePost(this.post.id, this.form.value.title, this.form.value.content);
    }
    // form.resetForm();
    this.form.reset();
  }
}
