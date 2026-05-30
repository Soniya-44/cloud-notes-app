"use client";

import { useEffect, useState } from "react";

import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

import {
  auth,
  db
} from "../../lib/firebase";

import { signOut } from "firebase/auth";

export default function Dashboard() {

  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<any[]>([]);

  const addNote = async () => {

    if (!auth.currentUser) return;

    await addDoc(
      collection(
        db,
        `users/${auth.currentUser.uid}/notes`
      ),
      {
        text: note,
        createdAt: new Date(),
      }
    );

    setNote("");
  };

  useEffect(() => {

    if (!auth.currentUser) return;

    const q = query(
      collection(
        db,
        `users/${auth.currentUser.uid}/notes`
      ),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setNotes(data);
    });

    return () => unsubscribe();

  }, []);

  const logout = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  return (
    <div className="p-10">

      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="flex gap-3 mb-10">

        <input
          type="text"
          placeholder="Write note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="border p-3 w-full rounded"
        />

        <button
          onClick={addNote}
          className="bg-black text-white px-5 rounded"
        >
          Add
        </button>

      </div>

      <div className="grid gap-4">

        {notes.map((n: any) => (

          <div
            key={n.id}
            className="border p-5 rounded-lg shadow"
          >
            {n.text}
          </div>

        ))}

      </div>

    </div>
  );
}