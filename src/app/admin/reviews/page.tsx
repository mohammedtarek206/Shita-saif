"use client";

import React from "react";
import { FiStar, FiCheck, FiX, FiMessageSquare } from "react-icons/fi";

const reviews = [
  { id: 1, user: "John Doe", product: "Samsung QLED TV", rating: 5, comment: "Amazing quality, highly recommend!", date: "2026-05-07", status: "Pending" },
  { id: 2, user: "Jane Smith", product: "LG Front Load Washer", rating: 4, comment: "Great machine but a bit loud during spin.", date: "2026-05-06", status: "Approved" },
  { id: 3, user: "Ahmed Ali", product: "Gree Split AC 2.25HP", rating: 2, comment: "Installation was delayed.", date: "2026-05-05", status: "Rejected" },
];

export default function ReviewsAdmin() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Customer Reviews</h1>
        <p className="text-gray-500">Monitor and moderate product feedback</p>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={(review as any)?._id || (review as any)?.id || (review as any)?.slug || (review as any)?.name || (review as any)?.title?.en || (review as any)?.title?.ar || JSON.stringify(review).substring(0, 20)} className="bg-white dark:bg-black/40 backdrop-blur-xl p-8 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center font-black">
                    {review.user.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-black">{review.user}</h3>
                    <p className="text-xs text-primary font-bold">{review.product}</p>
                  </div>
                  <div className="flex items-center gap-1 ml-4 bg-yellow-400/10 text-yellow-500 px-3 py-1 rounded-full text-xs font-black">
                    <FiStar /> {review.rating}
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <FiMessageSquare className="text-gray-300 mt-1 flex-shrink-0" />
                  <p className="text-gray-600 dark:text-gray-300 italic">"{review.comment}"</p>
                </div>
              </div>

              <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-gray-100 dark:border-white/5 pt-6 md:pt-0 md:pl-8">
                <div className="text-right mr-4 hidden md:block">
                  <p className="text-xs text-gray-500 font-bold uppercase">{review.date}</p>
                  <p className={`text-xs font-black uppercase tracking-widest mt-1 ${
                    review.status === 'Approved' ? 'text-green-500' :
                    review.status === 'Rejected' ? 'text-red-500' :
                    'text-yellow-500'
                  }`}>{review.status}</p>
                </div>
                
                <div className="flex gap-2">
                  <button className="w-12 h-12 bg-green-500/10 text-green-500 rounded-2xl hover:bg-green-500 hover:text-white transition-all flex items-center justify-center">
                    <FiCheck />
                  </button>
                  <button className="w-12 h-12 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center">
                    <FiX />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
