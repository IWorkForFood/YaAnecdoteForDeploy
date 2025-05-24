from rest_framework import serializers
from core.apps.music.models import Track, AuthorsCollection, UsersCollection, Author, ListeningHistory
from .services import delete_old_file
from django.contrib.auth import get_user_model
from django.utils import timezone

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = '__all__'

class TrackSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(many=True)
    user_of_likes = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=get_user_model().objects.all(),
        allow_empty=True
    )

    class Meta:
        model = Track
        fields = '__all__'



class BaseSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)


class CreateAuthorsCollectionSerializer(BaseSerializer):

    tracks = TrackSerializer(many=True, required=False)
    class Meta:
        model = AuthorsCollection
        fields = '__all__'
    
    def update(self, instance, validated_data):
        if validated_data.get('cover'):
            delete_old_file(instance.cover.path)
        return super().update(instance, validated_data)



class AuthorsCollectionSerializer(CreateAuthorsCollectionSerializer):
    
    user_of_likes = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=get_user_model().objects.all(),
        allow_empty=True
        
    )
    
    
    

    
    




class UsersCollectionSerializer(serializers.ModelSerializer):

    tracks = TrackSerializer(many=True, required=False, read_only=True)

    track_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Track.objects.all(),
        source='tracks',  # Связываем с полем tracks модели
        allow_empty=True,
        required=False
    )

    class Meta:
        model = UsersCollection
        fields = '__all__'
    


    
    def update(self, instance, validated_data):
        if 'cover' in validated_data and instance.cover:
            delete_old_file(instance.cover.path)
        return super().update(instance, validated_data)

class ListeningHistorySerializer(serializers.ModelSerializer):
    date = serializers.DateField(default=timezone.now().date())
    class Meta:
        model = ListeningHistory
        fields = [
            'id',
            'track',
            'start_time',
            'end_time',
            'duration_seconds',
            'date',
            'is_completed'
        ]
        read_only_fields = ['user', 'date']
    
    def validate(self, data):
        if data['end_time'] <= data['start_time']:
            raise serializers.ValidationError("End time must be after start time")
        return data