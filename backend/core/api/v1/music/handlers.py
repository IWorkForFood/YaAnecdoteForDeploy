from rest_framework import generics, parsers, viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view
from core.apps.music.models import (
    Track,
    AuthorsCollection,
    UsersCollection,
    Author,
    ListeningHistory,
)
from .serializers import (
    TrackSerializer,
    AuthorsCollectionSerializer,
    UsersCollectionSerializer,
    AuthorSerializer,
    CreateAuthorsCollectionSerializer,
    ListeningHistorySerializer,
)
from django.db import models
from rest_framework.permissions import IsAuthenticated
from .services import delete_old_file
import os
from .classes import MixedSerializer
from django.contrib.auth import get_user_model


class TrackView(viewsets.ModelViewSet):
    """CRUD для треков"""

    permission_classes = [IsAuthenticated]

    parser_classes = (parsers.MultiPartParser, parsers.FormParser)
    queryset = Track.objects.all()
    serializer_class = TrackSerializer

    def list(self, request, *args, **kwargs):
        # Модификация queryset перед отправкой
        queryset = self.get_queryset()

        serializer = self.get_serializer(queryset, many=True)
        data = serializer.data

        for track_data in data:
            track = Track.objects.get(id=track_data["id"])
            authors = track.author.all()

            # Получаем список имен авторов
            author_names = [author.name for author in authors]
            track_data["author_names"] = author_names

        return Response(data)

    def perform_destroy(self, instance):
        """Удаляем обложку(если не default) при удалении записи"""
        cover_field = instance._meta.get_field("cover")
        file = (
            cover_field.default()
            if callable(cover_field.default)
            else cover_field.default
        )
        if instance.cover.path != file:
            folder_path = os.path.dirname(instance.cover.pat)

            delete_old_file(instance.cover.path)

            # Удаляем папку, если она пуста
            if os.path.exists(folder_path) and not os.listdir(folder_path):
                os.rmdir(folder_path)


class AuthorsCollectionView(MixedSerializer, viewsets.ModelViewSet):
    """CRUD для сборников"""

    permission_classes = [IsAuthenticated]

    parser_classes = (parsers.MultiPartParser, parsers.FormParser)
    queryset = AuthorsCollection.objects.all()
    serializer_class = CreateAuthorsCollectionSerializer

    serializer_classes_by_action = {
        "list": AuthorsCollectionSerializer  # Для list используем расширенный сериализатор
    }

    def perform_destroy(self, instance):
        """Удаляем обложку(если не default) при удалении записи"""
        cover_field = instance._meta.get_field("cover")
        file = (
            cover_field.default()
            if callable(cover_field.default)
            else cover_field.default
        )
        if instance.cover.path != file:
            folder_path = os.path.dirname(instance.cover.path)
            delete_old_file(instance.cover.path)
        instance.delete()

    def partial_update(self, request, *args, **kwargs):
        # Получаем объект для обновления
        instance = self.get_object()

        # Проверяем входящие данные
        user_of_likes_data = request.data.getlist("user_of_likes", None)
        print(f"request.data: {request.data}")  # Для отладки

        print(user_of_likes_data)

        # Обрабатываем поле user_of_likes
        if user_of_likes_data is not None:
            # Если поле отправлено (включая пустой список)
            try:
                print(user_of_likes_data)
                print(list(user_of_likes_data))
                # Предполагаем, что user_of_likes_data — список ID или пустой список
                user_ids = (
                    [int(id) for id in user_of_likes_data] if user_of_likes_data else []
                )
                # Очищаем текущее ManyToMany-поле
                print("s", user_ids)
                instance.user_of_likes.clear()
                # Добавляем новые ID, если они есть
                if user_ids:
                    valid_users = get_user_model().objects.filter(id__in=user_ids)
                    instance.user_of_likes.set(valid_users)
            except (ValueError, TypeError) as e:
                return Response(
                    {"error": f"user_of_likes must be a list of integers HUI {e.args}"},
                    status=400,
                )

        # Создаем данные для сериализатора, исключая user_of_likes (уже обработано)
        serializer_data = {
            key: value for key, value in request.data.items() if key != "user_of_likes"
        }

        # Инициализируем сериализатор для остальных полей
        serializer = self.get_serializer(instance, data=serializer_data, partial=True)

        # Валидируем и сохраняем
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)


class UsersCollectionView(viewsets.ModelViewSet):
    """CRUD для плейлистов"""

    permission_classes = [IsAuthenticated]

    parser_classes = (parsers.MultiPartParser, parsers.FormParser)
    serializer_class = UsersCollectionSerializer

    def get_queryset(self):
        """
        Фильтруем коллекции пользователей по текущему аутентифицированному пользователю.
        """
        user = self.request.user
        return UsersCollection.objects.filter(user=user)

    def perform_create(self, serializer):
        """Привязываем к пользователю, который создал альбом"""
        serializer.save(user=self.request.user)

    def perform_destroy(self, instance):
        """Удаляем обложку(если не default) при удалении записи"""
        cover_field = instance._meta.get_field("cover")
        file = (
            cover_field.default()
            if callable(cover_field.default)
            else cover_field.default
        )
        if instance.cover.path != file:
            folder_path = os.path.dirname(instance.cover.path)

            delete_old_file(instance.cover.path)

            # Удаляем папку, если она пуста
            if os.path.exists(folder_path) and not os.listdir(folder_path):
                os.rmdir(folder_path)

        instance.delete()

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()

        # Проверяем входящие данные
        track_ids = (
            request.data.getlist("track_ids") if "track_ids" in request.data else None
        )
        # Получаем track_ids
        print(f"request.data: {request.data}")  # Для отладки

        # Обрабатываем поле tracks
        if track_ids is not None:
            try:
                # Преобразуем track_ids в список целых чисел
                track_ids = [int(tid) for tid in track_ids] if track_ids else []
                print("track_ids", track_ids)
                # Очищаем текущие связи
                instance.tracks.clear()
                # Добавляем новые треки, если они есть
                if track_ids:
                    valid_tracks = Track.objects.filter(id__in=track_ids)
                    print("valid_tracks", valid_tracks)
                    instance.tracks.set(valid_tracks)
                    # print(Track.objects.filter(tracks__id__in=track_ids))
            except (ValueError, TypeError) as e:
                return Response(
                    {"error": f"track_ids must be a list of integers: {str(e)}"},
                    status=400,
                )

        # Создаем данные для сериализатора, исключая track_ids (уже обработано)
        serializer_data = {
            key: value for key, value in request.data.items() if key != "track_ids"
        }

        print(serializer_data)
        # Инициализируем сериализатор для остальных полей
        serializer = self.get_serializer(instance, data=serializer_data, partial=True)

        # Валидируем и сохраняем
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)


class AuthorsView(viewsets.ReadOnlyModelViewSet):
    """CRUD для авторов"""

    queryset = Author.objects.all()
    serializer_class = AuthorSerializer


@api_view(["GET"])
def like_tracks_list(request):
    if request.method == "GET":
        liked_collections = AuthorsCollection.objects.filter(
            user_of_likes__id=request.user.id
        )
        serialized_data = AuthorsCollectionSerializer(
            liked_collections, many=True, context={"request": request}
        )
        return Response(serialized_data.data)


@api_view(["GET"])
def favourite_tracks(request):
    if request.method == "GET":
        liked_tracks = Track.objects.filter(user_of_likes__id=request.user.id)
        serialized_data = TrackSerializer(
            liked_tracks, many=True, context={"request": request}
        )
        return Response({"tracks": serialized_data.data})


@api_view(["GET"])
def get_reordered_tracks(request):
    if request.method == "GET":
        reordered_track = Track.objects.order_by("?").all()
        serialized_data = TrackSerializer(
            reordered_track, many=True, context={"request": request}
        )
        return Response({"tracks": serialized_data.data})


class ListeningHistoryViewSet(viewsets.ModelViewSet):
    serializer_class = ListeningHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ListeningHistory.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        track_id = serializer.validated_data["track"].id
        track = Track.objects.get(id=track_id)

        duration = serializer.validated_data["duration_seconds"]
        track_duration = (
            track.duration_seconds
        )  # Предполагаем, что есть способ получить длительность
        is_completed = duration >= (track_duration * 0.9)

        serializer.save(user=self.request.user, is_completed=is_completed)

        if is_completed:
            track.times_played = models.F("times_played") + 1
            track.save()
