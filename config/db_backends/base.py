"""
SQLite 성능 최적화를 위한 커스텀 백엔드
"""
from django.db.backends.sqlite3.base import (
    DatabaseWrapper as SQLiteDatabaseWrapper,
    Database,
    DatabaseFeatures,
    DatabaseOperations,
    DatabaseIntrospection,
    DatabaseCreation,
)


class DatabaseWrapper(SQLiteDatabaseWrapper):
    """SQLite 성능 최적화 설정이 포함된 커스텀 백엔드"""
    
    def get_new_connection(self, conn_params):
        conn = super().get_new_connection(conn_params)
        # SQLite 성능 최적화 PRAGMA 설정
        cursor = conn.cursor()
        try:
            # WAL 모드: 읽기와 쓰기를 동시에 수행 가능, 성능 향상
            cursor.execute("PRAGMA journal_mode=WAL;")
            # 캐시 크기: 64MB (음수는 KB 단위, -64000 = 64MB)
            cursor.execute("PRAGMA cache_size=-64000;")
            # 동기화 모드: NORMAL (FULL보다 빠르지만 안전)
            cursor.execute("PRAGMA synchronous=NORMAL;")
            # 임시 저장소: 메모리 사용 (디스크보다 빠름)
            cursor.execute("PRAGMA temp_store=MEMORY;")
            # 페이지 크기: 4096 (기본값, 최적화됨)
            cursor.execute("PRAGMA page_size=4096;")
        finally:
            cursor.close()
        return conn

