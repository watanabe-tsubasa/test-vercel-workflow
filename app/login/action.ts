"use server";

import { redirect } from "next/navigation";

export async function login(formData: FormData) {
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;
	console.log(`login pushed. email: ${email}, pass: ${password}`);

	// 仮の認証処理（ここでDBなどと照合）
	if (email === "test@example.com" && password === "password123") {
		// 認証成功 → Cookie設定やセッション開始など
		// ここでは仮にトップページにリダイレクト
		redirect("/");
	} else {
		throw new Error("メールアドレスまたはパスワードが正しくありません");
	}
}
