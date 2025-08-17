from rest_framework import serializers
from .models import Post, Comment, Message

class CommentSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(read_only=True)
    class Meta:
        model = Comment
        fields = ["id", "author", "content", "created_at"]

class PostSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)  # related_name="comments"
    class Meta:
        model = Post
        fields = ["id", "author", "title", "menu", "content", "created_at", "comments"]

class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.StringRelatedField(read_only=True)
    receiver = serializers.StringRelatedField(read_only=True)
    class Meta:
        model = Message
        fields = ["id", "sender", "receiver", "content", "created_at"]
