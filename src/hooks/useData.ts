import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Product, Testimonial, Category, Collection } from "../types";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("products")
      .select("*, category:categories!products_category_id_fkey(*), product_collections(collections(*))")
      .neq("is_active", false)
      .order("sort_order")
      .then(({ data, error }) => {
        if (!error && data) {
          const mappedProducts = data.map((p: any) => ({
            ...p,
            collections: p.product_collections?.map((pc: any) => pc.collections).filter(Boolean) || [],
          }));
          setProducts(mappedProducts as Product[]);
        }
        setLoading(false);
      });
  }, []);

  return { products, loading };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    supabase
      .from("categories")
      .select("*")
      .neq("is_active", false)
      .order("sort_order")
      .then(({ data }) => {
        if (data) {
          const raw = data as Category[];
          const parents = raw.filter(c => !c.parent_id);
          const mapped = parents.map(p => ({
            ...p,
            subcategories: raw.filter(c => c.parent_id === p.id),
          }));
          setCategories(mapped);
        }
      });
  }, []);

  return categories;
}

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    supabase
      .from("testimonials")
      .select("*")
      .neq("is_active", false)
      .order("sort_order")
      .then(({ data }) => {
        if (data) setTestimonials(data as Testimonial[]);
      });
  }, []);

  return testimonials;
}


export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    supabase
      .from("collections")
      .select("*")
      .neq("is_active", false)
      .order("sort_order")
      .then(({ data }) => {
        if (data) setCollections(data as Collection[]);
      });
  }, []);

  return collections;
}

export function usePage(slug: string) {
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("pages")
      .select("*")
      .eq("slug", slug)
      .neq("is_active", false)
      .single()
      .then(({ data }) => {
        if (data) setPage(data);
        setLoading(false);
      });
  }, [slug]);

  return { page, loading };
}
