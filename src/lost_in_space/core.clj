(ns lost-in-space.core)

(defn render-page [context page]
  "<h1>Hello, World!</h1>")

(def config
  {:site/title "lost-in-space"
   :powerpack/content-dir "resources/public"
   :powerpack/render-page #'render-page})
