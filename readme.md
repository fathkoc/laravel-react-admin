
# Proje Dokümantasyonu: Görev Yönetim Sistemi

## 1. Proje Özeti
Bu proje, kullanıcıların görevlerini yönetebileceği bir web uygulamasıdır. Kullanıcılar görevleri oluşturabilir, düzenleyebilir, silebilir ve durumlarını güncelleyebilir. Ayrıca bildirim sistemleri ve görevlerin zamanında başlaması için kuyruk işleme yetenekleri eklenmiştir.

## 1.2. Authentication Problemi
Uygulamada, kimlik doğrulama işlemleri sırasında karşılaşılan sorunlar nedeniyle görev yönetimi ile ilgili route'lar, middleware yapısından çıkarılmıştır. Bu karar, kütüphane versiyonundaki hatalar nedeniyle alınmıştır. Uygulamanın mevcut versiyonuyla uyumlu olmayan güncellemeler, bazı kütüphanelerde hatalara yol açmış ve bu durum, middleware üzerinden kimlik doğrulaması yapmayı zorlaştırmıştır.

Kütüphane güncellemeleri sırasında, uygulamanın yapısını bozmamak adına eski versiyonlar kullanılmıştır. Ancak, bu eski versiyonlar ile yapılan işlemler sırasında bazı hatalar ortaya çıkmıştır. Özellikle auth middleware kullanımıyla ilgili sorunlar yaşanmıştır.

## 2. Yapılan Adımlar

### 2.1. API Geliştirmeleri
- Yeni API endpoint'leri oluşturulmuştur:
  - **GET /api/tasks**: Tüm görevleri listeleme
  - **POST /api/tasks**: Yeni görev oluşturma
  - **GET /api/tasks/{task}**: Belirli bir görevi gösterme
  - **PUT /api/tasks/{task}**: Görevi güncelleme
  - **DELETE /api/tasks/{task}**: Görevi silme

### 2.2. Model ve Migration
- **Task Model**: Görevlerin veritabanında nasıl saklanacağını tanımlayan model oluşturuldu.
- **Migration**: Görevler tablosunu oluşturmak için migration dosyası oluşturuldu.

```php
// Migration Örneği
public function up()
{
    Schema::create('tasks', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->text('description')->nullable();
        $table->string('status')->default('pending');
        $table->timestamps();
    });
}
```

### 2.3. Eager Loading ile N+1 Sorgu Problemi Çözümü
- Backend'de N+1 sorgu problemini çözmek için Eager Loading kullanıldı.
```php
public function index()
{
    return Task::with('user')->get(); // Kullanıcı bilgilerini de içerecek şekilde getir
}
```

### 2.4. Frontend Geliştirmeleri
- React uygulamasında görev yönetimi arayüzü oluşturuldu:
  - **TaskDashboard**: Görevlerin listelendiği, eklendiği ve düzenlendiği ana bileşen.
  - **TaskForm**: Yeni görev oluşturmak için kullanılan form bileşeni.
  - **KanbanBoard**: Görevlerin durumunu gösteren ve sürükle-bırak ile yönetilen Kanban görünümü.


## 3. Fake Data
- Test amacıyla fake veriler oluşturuldu ve veritabanına dolduruldu. Laravel factory'leri kullanılarak sahte veriler eklendi.

```php
factory(Task::class, 50)->create(); // 50 adet sahte görev oluştur
```


## 5. Sonuç
Bu proje, görev yönetim sisteminin yanı sıra, kullanıcı doğrulama, performans optimizasyonu ve API geliştirme süreçlerini kapsamaktadır. Ayrıca, uygulama güvenliği ve veri bütünlüğü sağlanarak kullanıcı deneyimi iyileştirilmiştir.
