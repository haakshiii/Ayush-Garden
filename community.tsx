'use client';

import { useState } from 'react';
import { useCollection, useFirestore, useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { collection } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Link from 'next/link';
import { CreatePostForm } from '@/components/community/create-post-form';
import { PostCard } from '@/components/community/post-card';
import { useMemoFirebase } from '@/firebase/provider';

export default function CommunityPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const postsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'posts');
  }, [firestore]);

  const { data: posts, isLoading, error } = useCollection(postsQuery);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">
            Community Forum
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Ask questions, share knowledge, and connect with AYUSH experts and enthusiasts.
          </p>
        </div>
        <div>
          {isUserLoading ? (
            <Button disabled>
              <Loader2 className="animate-spin" />
              Loading...
            </Button>
          ) : user ? (
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Start a Discussion
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle className="font-headline">Create a New Post</DialogTitle>
                  <DialogDescription>
                    Ask a question or share something with the community.
                  </DialogDescription>
                </DialogHeader>
                <CreatePostForm onSubmissionSuccess={() => setIsFormOpen(false)} />
              </DialogContent>
            </Dialog>
          ) : (
            <Button asChild>
              <Link href="/login">Login to Participate</Link>
            </Button>
          )}
        </div>
      </div>

      {isLoading && !posts && (
        <div className="flex justify-center items-center p-16">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      )}

      {error && (
        <div className="text-destructive text-center">
          <p>Failed to load posts. Please try again later.</p>
        </div>
      )}

      {posts && posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        !isLoading && (
          <p className="text-center text-muted-foreground pt-8">
            No discussions yet. Be the first to start one!
          </p>
        )
      )}
    </div>
  );
  'use client';

import { useDoc, useCollection, useFirestore, useUser } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { notFound, useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CommentForm } from '@/components/community/comment-form';
import { CommentCard } from '@/components/community/comment-card';
import { useMemoFirebase } from '@/firebase/provider';

export default function PostPage() {
  const { postId } = useParams();
  const firestore = useFirestore();

  const postRef = useMemoFirebase(() => {
    if (!firestore || !postId) return null;
    return doc(firestore, 'posts', postId as string);
  }, [firestore, postId]);

  const commentsQuery = useMemoFirebase(() => {
    if (!postRef) return null;
    return collection(postRef, 'comments');
  }, [postRef]);

  const { data: post, isLoading: isPostLoading, error: postError } = useDoc(postRef);
  const { data: comments, isLoading: areCommentsLoading, error: commentsError } = useCollection(commentsQuery);
  const { user } = useUser();

  if (isPostLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
      </div>
    );
  }

  if (postError) {
    return <p className="text-destructive">Error loading post.</p>;
  }

  if (!post) {
    notFound();
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name[0];
  };

  const formattedDate = post.createdAt?.toDate ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true }) : 'just now';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary">{post.title}</CardTitle>
          <CardDescription className="flex items-center gap-2 text-sm pt-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={post.authorPhotoURL || ''} alt={post.authorName || 'User'} />
              <AvatarFallback>{getInitials(post.authorName)}</AvatarFallback>
            </Avatar>
            <span>
              Posted by <span className="font-semibold text-accent">{post.authorName || 'Anonymous'}</span>
            </span>
            <span>•</span>
            <span>{formattedDate}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-base whitespace-pre-wrap">{post.content}</p>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold font-headline text-primary">Comments</h2>
        {user && <CommentForm postId={postId as string} />}
        
        {areCommentsLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="animate-spin h-4 w-4" />
                <span>Loading comments...</span>
            </div>
        )}

        {commentsError && <p className="text-destructive">Error loading comments.</p>}

        {comments && comments.length > 0 ? (
            <div className="space-y-4">
                {comments.map((comment) => (
                    <CommentCard key={comment.id} comment={comment} />
                ))}
            </div>
        ) : (
            !areCommentsLoading && <p className="text-muted-foreground text-center py-4">No comments yet. Be the first to reply!</p>
        )}
      </div>
    </div>
  );
}
}
