import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Product, Collection, Testimonial, Category } from "../types";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data, error }) => {
        if (!error && data) setProducts(data as Product[]);
        setLoading(false);
      });
  }, []);

  return { products, loading };
}

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    supabase
      .from("collections")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => {
        if (data) setCollections(data as Collection[]);
      });
  }, []);

  return collections;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => {
        if (data) setCategories(data as Category[]);
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
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => {
        if (data) setTestimonials(data as Testimonial[]);
      });
  }, []);

  return testimonials;
}
