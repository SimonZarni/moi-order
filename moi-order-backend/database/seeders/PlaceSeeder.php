<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Place;
use App\Models\PlaceImage;
use App\Models\Tag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PlaceSeeder extends Seeder
{
    /** Picsum image dimensions used for all placeholder images. */
    private const IMG_W = 800;
    private const IMG_H = 600;

    /** Storage directory — must match FileStorageService convention. */
    private const DIR = 'place-images';

    public function run(): void
    {
        $restaurant = Category::where('slug', 'restaurant')->first();
        $attraction = Category::where('slug', 'attraction')->first();
        $market     = Category::where('slug', 'market')->first();
        $temple     = Category::where('slug', 'temple')->first();
        $hotel      = Category::where('slug', 'hotel')->first();

        $tagFree    = Tag::where('slug', 'free-entry')->first();
        $tagFamily  = Tag::where('slug', 'family-friendly')->first();
        $tagOutdoor = Tag::where('slug', 'outdoor')->first();
        $tagNight   = Tag::where('slug', 'nightlife')->first();
        $tagPhoto   = Tag::where('slug', 'photography')->first();
        $tagBudget  = Tag::where('slug', 'budget')->first();
        $tagIndoor  = Tag::where('slug', 'indoor')->first();
        $tagSwim    = Tag::where('slug', 'swimming')->first();

        $places = [
            [
                'data' => [
                    'category_id'       => $restaurant->id,
                    'name_my'           => 'မြန်မာ့အရသာဆိုင်',
                    'name_en'           => 'Myanmar Taste Restaurant',
                    'name_th'           => 'ร้านอาหารพม่าแท้',
                    'short_description' => 'မြန်မာ့ရိုးရာအစားအစာများပေးသောဆိုင်',
                    'long_description'  => 'မြန်မာ့ရိုးရာချက်နည်းဖြင့် ချက်ပြုတ်သော အစားအစာများကို တင်ဆက်သည့် ဆိုင်ဖြစ်ပါသည်။ မော့ဟင်းချာ၊ ရှမ်းခေါက်ဆွဲ နှင့် နန်းဂျပ်တို့ကို ရနိုင်သည်။',
                    'address'           => '123 ถนนสุขุมวิท',
                    'city'              => 'Mae Sot',
                    'latitude'          => 16.7134,
                    'longitude'         => 98.5694,
                    'opening_hours'     => '08:00 - 21:00',
                    'contact_phone'     => '+66812345678',
                    'website'           => null,
                ],
                'tags'       => [$tagBudget, $tagIndoor, $tagFamily],
                'imageCount' => 2,
            ],
            [
                'data' => [
                    'category_id'       => $attraction->id,
                    'name_my'           => 'မိုင်းဆောင်ဗလောင်တောင်',
                    'name_en'           => 'Hin Pha Daeng Mountain',
                    'name_th'           => 'ดอยหินผาแดง',
                    'short_description' => 'သဘာဝအလှများကိုကြည့်ရှုနိုင်သောတောင်',
                    'long_description'  => 'ပတ်ဝန်းကျင်ရှုခင်းများကို မြင်ရမည့် လှပသောတောင်တစ်ခုဖြစ်ပြီး ဓာတ်ပုံရိုက်ကူးရန် အကောင်းဆုံးနေရာတစ်ခုဖြစ်သည်။ မှောင်မိုက်ချိန်နှင့် မနက်ဦးများတွင် ထူးကဲသောမြင်ကွင်းကို မြင်ရနိုင်သည်။',
                    'address'           => 'ตำบลแม่สอด อำเภอแม่สอด',
                    'city'              => 'Mae Sot',
                    'latitude'          => 16.7250,
                    'longitude'         => 98.5750,
                    'opening_hours'     => '06:00 - 18:00',
                    'contact_phone'     => null,
                    'website'           => null,
                ],
                'tags'       => [$tagFree, $tagOutdoor, $tagPhoto],
                'imageCount' => 1,
            ],
            [
                'data' => [
                    'category_id'       => $market->id,
                    'name_my'           => 'နယ်စပ်ဈေး',
                    'name_en'           => 'Mae Sot Border Market',
                    'name_th'           => 'ตลาดชายแดนแม่สอด',
                    'short_description' => 'မြန်မာ-ထိုင်းနယ်စပ်ကုန်ပစ္စည်းများ',
                    'long_description'  => 'မြန်မာနှင့် ထိုင်းနှစ်ဦးနှစ်ဖက် ကုန်ပစ္စည်းများကို ရောင်းချသော နယ်စပ်ဈေးကြီးဖြစ်ပါသည်။ အဝတ်အထည်၊ အစားအသောက်နှင့် လက်မှုပစ္စည်းများ ရရှိနိုင်သည်။',
                    'address'           => 'ถนนอินทรคีรี ตำบลแม่สอด',
                    'city'              => 'Mae Sot',
                    'latitude'          => 16.7180,
                    'longitude'         => 98.5620,
                    'opening_hours'     => '07:00 - 20:00',
                    'contact_phone'     => '+66891234567',
                    'website'           => null,
                ],
                'tags'       => [$tagBudget, $tagOutdoor, $tagNight],
                'imageCount' => 3,
            ],
            [
                'data' => [
                    'category_id'       => $temple->id,
                    'name_my'           => 'ဝပ်ဒုံမုဏ္ဍပ်',
                    'name_en'           => 'Wat Don Mun Temple',
                    'name_th'           => 'วัดดอนมูล',
                    'short_description' => 'မြတ်စွာဘုရားရှိခိုးကန်တော့ရာဘုရားကျောင်း',
                    'long_description'  => 'ထိုင်းဗုဒ္ဓဘာသာ ဘုရားကျောင်းတစ်ခုဖြစ်ပြီး ဒေသခံ မြန်မာများနှင့် ထိုင်းများ ဝတ်ပြုကိုးကွယ်သောနေရာဖြစ်သည်။ ငြိမ်သက်ဆိတ်ညံ့ပြီး ပတ်ဝန်းကျင်လှပသည်။',
                    'address'           => 'ถนนสาย 1090 ตำบลแม่สอด',
                    'city'              => 'Mae Sot',
                    'latitude'          => 16.7090,
                    'longitude'         => 98.5710,
                    'opening_hours'     => '06:00 - 20:00',
                    'contact_phone'     => null,
                    'website'           => null,
                ],
                'tags'       => [$tagFree, $tagFamily, $tagPhoto],
                'imageCount' => 1,
            ],
            [
                'data' => [
                    'category_id'       => $hotel->id,
                    'name_my'           => 'မဲဆောက်ဟိုတယ်',
                    'name_en'           => 'Mae Sot Plaza Hotel',
                    'name_th'           => 'โรงแรมแม่สอดพลาซ่า',
                    'short_description' => 'ဗဟိုမြို့ပြတွင် တည်ရှိသောဟိုတယ်',
                    'long_description'  => 'မဲဆောက်မြို့ ဗဟိုတွင် တည်ရှိပြီး ရေကူးကန်၊ အခမဲ့ WiFi နှင့် နံနက်စာပါဝင်သောဟိုတယ်ကောင်းတစ်ခုဖြစ်ပါသည်။ မြန်မာနယ်စပ်သို့ ၁၀ မိနစ်သာ ကြာသည်။',
                    'address'           => '88/1 ถนนอินทรคีรี ตำบลแม่สอด',
                    'city'              => 'Mae Sot',
                    'latitude'          => 16.7160,
                    'longitude'         => 98.5680,
                    'opening_hours'     => '24 ชั่วโมง',
                    'contact_phone'     => '+66553456789',
                    'website'           => 'https://maesotplaza.example.com',
                ],
                'tags'       => [$tagFamily, $tagIndoor, $tagSwim],
                'imageCount' => 2,
            ],
        ];

        // Seed number increments across all images so each gets a unique Picsum photo.
        $seed = 10;

        foreach ($places as $entry) {
            $place = Place::create($entry['data']);

            $tagIds = collect($entry['tags'])
                ->filter()
                ->pluck('id')
                ->all();
            $place->tags()->attach($tagIds);

            for ($i = 0; $i < $entry['imageCount']; $i++) {
                $path = $this->downloadPlaceholder($seed++);

                PlaceImage::create([
                    'place_id'   => $place->id,
                    'path'       => $path,
                    'sort_order' => $i,
                ]);
            }
        }
    }

    /**
     * Download a placeholder image from Picsum into the private disk.
     * Returns the stored path (relative to the disk root).
     *
     * Uses a fixed Picsum seed so re-seeding produces the same images.
     */
    private function downloadPlaceholder(int $seed): string
    {
        $url      = 'https://picsum.photos/seed/'.$seed.'/'.self::IMG_W.'/'.self::IMG_H;
        $response = Http::timeout(15)->get($url);

        $filename = Str::uuid()->toString().'.jpg';
        $path     = self::DIR.'/'.$filename;

        Storage::disk('local')->put($path, $response->body());

        return $path;
    }
}
