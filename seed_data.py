"""
Run this once to populate restaurants and menu items:
    python manage.py shell < seed_data.py
OR paste the content inside manage.py shell
"""
import django, os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "food_backend.settings")
django.setup()

from restaurants.models import Restaurant, MenuItem

# ── 1. Restaurants ────────────────────────────────────────────────
restaurants = [
    dict(id=1, name="Biryani House",   cuisine="Biryani",     rating=4.8, delivery_time="25–35 min", emoji="🍛",
         image_url="https://images.unsplash.com/photo-1630851840633-f96999247032?w=400&q=80"),
    dict(id=2, name="Pizza Palace",    cuisine="Pizza",       rating=4.6, delivery_time="20–30 min", emoji="🍕",
         image_url="https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400&q=80"),
    dict(id=3, name="Burger Junction", cuisine="Burgers",     rating=4.5, delivery_time="15–25 min", emoji="🍔",
         image_url="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80"),
    dict(id=4, name="South Spice",     cuisine="South Indian",rating=4.7, delivery_time="20–30 min", emoji="🥘",
         image_url="https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&q=80"),
    dict(id=5, name="Wok & Roll",      cuisine="Chinese",     rating=4.4, delivery_time="25–40 min", emoji="🥡",
         image_url="https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80"),
    dict(id=6, name="Sweet Cravings",  cuisine="Desserts",    rating=4.9, delivery_time="15–25 min", emoji="🎂",
         image_url="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80"),
]
for r in restaurants:
    obj, created = Restaurant.objects.update_or_create(id=r["id"], defaults=r)
    print(f"{'✅ Created' if created else '🔄 Updated'} restaurant: {obj.name}")

# ── 2. Menu Items ─────────────────────────────────────────────────
menus = [
    # (restaurant_id, item_id, name, price, image_url, is_veg)
    (1,101,"Chicken Biryani",250,"https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&q=80",False),
    (1,102,"Mutton Biryani", 350,"https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&q=80",False),
    (1,103,"Paneer Biryani", 220,"https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80",True),
    (2,201,"Margherita Pizza",299,"https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400&q=80",True),
    (2,202,"Veggie Pizza",   349,"https://images.unsplash.com/photo-1511689660979-10d2b1aada49?w=400&q=80",True),
    (2,203,"Cheese Burst Pizza",399,"https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=400&q=80",True),
    (3,301,"Classic Burger", 149,"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",False),
    (3,302,"Chicken Burger", 199,"https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80",False),
    (3,303,"Veg Burger",     129,"https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?w=400&q=80",True),
    (4,401,"Masala Dosa",    120,"https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&q=80",True),
    (4,402,"Idli Sambar",     80,"https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80",True),
    (4,403,"Medu Vada",       90,"https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80",True),
    (5,501,"Veg Noodles",    180,"https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&q=80",True),
    (5,502,"Fried Rice",     200,"https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80",True),
    (5,503,"Manchurian",     170,"https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80",True),
    (6,601,"Chocolate Cake", 150,"https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80",True),
    (6,602,"Ice Cream Sundae",120,"https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80",True),
    (6,603,"Brownie",        100,"https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80",True),
]
for (rid, mid, name, price, url, veg) in menus:
    r = Restaurant.objects.get(id=rid)
    obj, created = MenuItem.objects.update_or_create(
        id=mid,
        defaults={"restaurant":r,"name":name,"price":price,"image_url":url,"is_veg":veg}
    )
    print(f"  {'✅' if created else '🔄'} {name} (₹{price})")

print(f"\n🎉 Done! Restaurants: {Restaurant.objects.count()} | Menu Items: {MenuItem.objects.count()}")