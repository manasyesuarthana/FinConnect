import React, { useState } from 'react';
import { useApp } from '../../lib/AppContext';
import { PageLayout } from '../PageLayout';
import { PageHeader } from '../PageHeader';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { MemberAvatar } from '../MemberAvatar';
import { EmptyState } from '../EmptyState';
import { MessageSquare, Heart, MessageCircle, Send, ThumbsUp } from 'lucide-react';
import { toast } from 'sonner';

export function CommunityFeedPage() {
  const { communityPosts, createPost, reactToPost, addComment, currentUser, getUserById } = useApp();
  const [newPostContent, setNewPostContent] = useState('');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const handleCreatePost = () => {
    if (!newPostContent.trim()) {
      toast.error('Please enter some content');
      return;
    }

    createPost({
      authorId: currentUser?.id || 'user-1',
      content: newPostContent
    });

    setNewPostContent('');
    toast.success('Post shared!');
  };

  const handleAddComment = (postId: string) => {
    const content = commentInputs[postId];
    if (!content?.trim()) return;

    addComment(postId, content);
    setCommentInputs({ ...commentInputs, [postId]: '' });
    toast.success('Comment added!');
  };

  return (
    <PageLayout maxWidth="medium">
      <PageHeader
        title="Community Feed"
        description="Share tips, learn from others, and connect with the community"
      />

      {/* Create Post */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            {currentUser && (
              <MemberAvatar name={currentUser.name} avatar={currentUser.avatar} size="md" />
            )}
            <div className="flex-1 space-y-3">
              <Textarea
                placeholder="Share a budgeting tip, win, or question..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={3}
                aria-label="Write a post"
              />
              <div className="flex justify-end">
                <Button onClick={handleCreatePost} className="gap-2">
                  <Send className="h-4 w-4" aria-hidden="true" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      {communityPosts.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No posts yet"
          description="Be the first to share a tip or ask a question!"
          action={{
            label: "Share Your First Post",
            onClick: () => document.querySelector('textarea')?.focus()
          }}
        />
      ) : (
        <div className="space-y-4">
          {communityPosts.map(post => {
            const author = getUserById(post.authorId);
            const likeReaction = post.reactions.find(r => r.type === 'like');

            return (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    {author && (
                      <MemberAvatar name={author.name} avatar={author.avatar} size="md" />
                    )}
                    <div className="flex-1">
                      <p>{author?.name}</p>
                      <time className="text-muted-foreground" dateTime={post.createdAt}>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </time>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="whitespace-pre-wrap">{post.content}</p>

                  {/* Reactions */}
                  <div className="flex items-center gap-4 pt-2 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => reactToPost(post.id, 'like')}
                      className="gap-2"
                      aria-label={`Like post. Current likes: ${likeReaction?.count || 0}`}
                    >
                      <Heart className="h-4 w-4" aria-hidden="true" />
                      {likeReaction?.count || 0}
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <MessageCircle className="h-4 w-4" aria-hidden="true" />
                      {post.comments.length}
                    </Button>
                  </div>

                  {/* Comments */}
                  {post.comments.length > 0 && (
                    <div className="space-y-3 pt-4 border-t">
                      {post.comments.map(comment => {
                        const commentAuthor = getUserById(comment.authorId);
                        return (
                          <div key={comment.id} className="flex gap-3">
                            {commentAuthor && (
                              <MemberAvatar
                                name={commentAuthor.name}
                                avatar={commentAuthor.avatar}
                                size="sm"
                              />
                            )}
                            <div className="flex-1 bg-muted rounded-lg p-3">
                              <p>{commentAuthor?.name}</p>
                              <p className="text-muted-foreground mt-1">{comment.content}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Add Comment */}
                  <div className="flex gap-2 pt-2">
                    {currentUser && (
                      <MemberAvatar
                        name={currentUser.name}
                        avatar={currentUser.avatar}
                        size="sm"
                      />
                    )}
                    <div className="flex-1 flex gap-2">
                      <Textarea
                        placeholder="Write a comment..."
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                        rows={1}
                        aria-label="Write a comment"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleAddComment(post.id)}
                        disabled={!commentInputs[post.id]?.trim()}
                        aria-label="Post comment"
                      >
                        <Send className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </PageLayout>
  );
}
