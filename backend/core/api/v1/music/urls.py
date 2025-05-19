from django.urls import path
from .handlers import (TrackView, AuthorsCollectionView, UsersCollectionView, AuthorsView, like_tracks_list, favourite_tracks, get_reordered_tracks)


urlpatterns = [
    path("track/<int:pk>", TrackView.as_view({"put":"update", "patch": "partial_update", "delete":"destroy", "get":"retrieve"}), name="retrieve_update_destroy_list_track"),
    path("track/", TrackView.as_view({"get":"list", "post":"create"}), name="create_list_track"),
    path("authors_collection/<int:pk>", AuthorsCollectionView.as_view({"put":"update", "patch": "partial_update", "delete":"destroy", "get":"retrieve"}), name="create_list_track"),
    path("authors_collection/", AuthorsCollectionView.as_view({"get":"list", "post":"create"}), name="create_list_track"),
    path("users_collection/<int:pk>", UsersCollectionView.as_view({"put":"update", "patch": "partial_update", "delete":"destroy", "get":"retrieve"}), name="create_list_track"),
    path("users_collection/", UsersCollectionView.as_view({"get":"list", "post":"create"}), name="create_list_track"),
    path("author/", AuthorsView.as_view({"get":"list"}), name="get_authors"),
    path("liked_authors_collections/", like_tracks_list, name="like_a_collections"),
    path("favourite_tracks/", favourite_tracks, name="favourite_tracks"),
    path("reordered_tracks/", get_reordered_tracks, name="reordered_tracks")

]
