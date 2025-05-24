from django.db import models

from django.db import models
from django.utils import timezone
from datetime import datetime
from django.contrib.auth import get_user_model
from mutagen.mp3 import MP3
import uuid

import os

def track_audio_files_directory_path(instance, filename):
    now = datetime.now().strftime('%Y/%m/%d/%H/%M/%S')
    uuid_name = uuid.uuid4()
    return f'audio/tracks/track_{uuid_name}/{filename}'

def track_covers_directory_path(instance, filename):
    now = datetime.now().strftime('%Y/%m/%d/%H/%M/%S')
    uuid_name = uuid.uuid4()
    return f'images/covers/tracks/cover_{uuid_name}/{filename}'

def authors_collection_covers_directory_path(instance, filename):
    now = datetime.now().strftime('%Y/%m/%d/%H/%M/%S')
    uuid_name = uuid.uuid4()
    return f'images/covers/a_collections/collection_{uuid_name}/{filename}'

def users_collection_covers_directory_path(instance, filename):
    now = datetime.now().strftime('%Y/%m/%d/%H/%M/%S')
    uuid_name = uuid.uuid4()
    return f'images/covers/u_collections/collection_{uuid_name}/{filename}'

class Author(models.Model):
    name = models.CharField()

class Track(models.Model): 
    author = models.ManyToManyField(Author, related_name='tracks')
    title = models.CharField()
    description = models.TextField()
    cover = models.ImageField(upload_to=track_covers_directory_path, default="images/covers/tracks/default/track.jpg", blank=True, null=True)
    audio_file = models.FileField(upload_to=track_audio_files_directory_path)
    authors_collection = models.ManyToManyField('AuthorsCollection', blank = True, related_name="a_collection")
    users_collection = models.ManyToManyField('UsersCollection', blank = True, related_name="u_collection")
    user_of_likes = models.ManyToManyField(get_user_model(), related_name='likes_of_tracks', blank = True, null=True)

    duration_seconds = models.PositiveIntegerField(default=0, verbose_name="Длительность (сек)")
    
    def save(self, *args, **kwargs):
        if not self.duration_seconds and self.audio_file:
            try:
                # Полный путь к файлу
                file_path = self.audio_file.path
                if os.path.exists(file_path):
                    audio = MP3(file_path)
                    self.duration_seconds = int(audio.info.length)
            except Exception as e:
                print(f"Error calculating duration: {e}")
                self.duration_seconds = 0
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.author} - {self.title} - {self.pk}'


class AuthorsCollection(models.Model):
    author = models.ManyToManyField(Author, related_name='play_lists')
    title = models.CharField(max_length=50)
    description = models.TextField(max_length=1000)
    cover = models.ImageField(upload_to=authors_collection_covers_directory_path, blank=True, null=True)
    tracks = models.ManyToManyField(Track, blank=True, null=True, related_name='track_author_collections')
    user_of_likes = models.ManyToManyField(get_user_model(), related_name='likes_of_authora_collections', blank=True, null=True)

class UsersCollection(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete = models.CASCADE, related_name='collections', blank=True)
    title = models.CharField(max_length=50)
    description = models.TextField(max_length=1000)
    cover = models.ImageField(upload_to=users_collection_covers_directory_path, default="images/covers/u_collections/default/default_u_col.png", blank=True, null=True)
    tracks = models.ManyToManyField(Track, blank=True, null=True, related_name='track_user_collections')

    def __str__(self):
        return f'{self.user} - {self.title} - {self.pk}'


class ListeningHistory(models.Model):
    user = models.ForeignKey(
        get_user_model(), 
        on_delete=models.CASCADE,
        related_name='listening_history'
    )
    track = models.ForeignKey(
        'Track',
        on_delete=models.CASCADE,
        related_name='play_history'
    )
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    duration_seconds = models.PositiveIntegerField()
    date = models.DateField(default=timezone.now)
    is_completed = models.BooleanField(default=False)  # Прослушан ли трек полностью
    
    class Meta:
        verbose_name_plural = "Listening Histories"
        indexes = [
            models.Index(fields=['user', 'date']),
            models.Index(fields=['track']),
            models.Index(fields=['is_completed']),
        ]
        ordering = ['-start_time']






