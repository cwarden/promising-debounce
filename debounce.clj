(defn debounce [c ms]
  (let [c' (chan)]
    (go
      (loop [start nil loc (<! c)]
        (if (nil? start)
          (do
            (>! c' loc)
            (recur (js/Date.)))
          (let [loc (<! c)]
            (if (>= (- (js/Date.) start) ms)
              (recur nil loc)
              (recur (js/Date.) loc))))))
    c'))